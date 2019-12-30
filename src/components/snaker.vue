<template>
  <div :style="{width:cardColumn*10+'px',height:cardRow*10+'px'}" class="box">
    <div
      :style="{width:cardColumn*10+'px'}"
      class="pixelline"
      v-for="(item,index) in allArr"
      :key="index"
    >
      <div
        class="pixel"
        v-for="(item1,index1) in item"
        :key="index1"
        :style="{backgroundColor:item1.showBlack?'#000':'',border:cardshowBorder?'1px solid black':'',width:cardshowBorder? '8px':'10px',height:cardshowBorder? '8px':'10px'}"
      ></div>
    </div>
    <div style="position:absolute;left:400px;height:200px;">{{snakerLiveState}}</div>
  </div>
</template>
<script>
export default {
  name: "HelloWorld",
  props: {
    //有几行
    row: {
      type: Number,
      default: 30
    },
    //有几列
    column: {
      type: Number,
      default: 30
    },
    //蛇每移动一步所需要的的时间
    animationTime: {
      type: Number,
      default: 500
    },
    //是否显示网格
    showBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allArr: [],
      //上一次的上下左右
      direction: "",
      //最新的上下左右
      newDirection: "",
      //定时器固定时间移动一格
      timer: null,
      //当前食物的坐标
      food: {
        row: "",
        column: ""
      },
      //蛇的身体
      snakerArr: [],
      //蛇的状态（死，活）
      snakerLiveState: "die"
    };
  },
  methods: {
    //造二维数组
    buildArr() {
      this.allArr = [];
      for (let i = 0; i < this.row; i++) {
        this.allArr.push([]);
        for (let k = 0; k < this.column; k++) {
          this.allArr[i].push({
            //是否变成黑块
            showBlack: false
          });
        }
      }
    },
    kankan(data) {
      console.log(data);
    },
    //生成随机数
    getRandomNumber() {
      let getRandomNumber = {
        row: Math.floor(Math.random() * this.row),
        column: Math.floor(Math.random() * this.column)
      };
      if (this.allArr[getRandomNumber.row][getRandomNumber.column].showBlack) {
        this.getRandomNumber();
      } else {
        this.food.row = getRandomNumber.row;
        this.food.column = getRandomNumber.column;
        this.allArr[getRandomNumber.row][
          getRandomNumber.column
        ].showBlack = true;
      }
    },
    //判断边界值情况(这次操作是否为有效操作)
    judgeBoundary(data) {
      console.log(data);
      let row = data.row;
      let column = data.column;
      //如果撞到边界蛇会死
      if (row > this.row || row < 0 || column < 0 || column > this.column) {
        this.snakerLiveState = "die";
        return false;
      }
      //蛇的长度大于1时如果蛇是向前进的 那么向后的操作就静默掉，同理 相反的操作都静默掉
      if (this.snakerArr.length > 1) {
        if (
          this.snakerArr[1].row == data.row &&
          this.snakerArr[1].column == data.column
        ) {
          console.log("相反方向");
          return false;
        }
      }
      if (this.snakerArr.length > 3) {
        //判断蛇是否撞到自己的身体，如果撞到就算挂了
        let arr = JSON.parse(JSON.stringify(this.snakerArr));
        arr.pop();
        if (
          arr.some(item => {
            return item.row == data.row && item.column == data.column;
          })
        ) {
          this.snakerLiveState = "die";
          return false;
        }
      }
      return true;
    },
    //预计要走到的坐标
    makeHeadProphesy(direction) {
      if (direction == "左") {
        return {
          row: this.snakerArr[0].row,
          column: this.snakerArr[0].column - 1
        };
      } else if (direction == "右") {
        return {
          row: this.snakerArr[0].row,
          column: this.snakerArr[0].column + 1
        };
      } else if (direction == "上") {
        return {
          row: this.snakerArr[0].row - 1,
          column: this.snakerArr[0].column
        };
      } else if (direction == "下") {
        return {
          row: this.snakerArr[0].row + 1,
          column: this.snakerArr[0].column
        };
      }
    }
  },
  computed: {
    cardRow: function() {
      return this.row;
    },
    cardColumn: function() {
      return this.column;
    },
    cardshowBorder: function() {
      return this.showBorder;
    }
  },
  watch: {
    snakerLiveState: function(val) {
      if (val == "die") {
        alert("你屎了");
        clearInterval(this.timer);
        this.timer = null;
        this.buildArr();
        this.snakerArr = [];
        this.snakerArr.push({ row: Math.floor(this.row / 2), column: 0 });
        this.allArr[Math.floor(this.row / 2)][0].showBlack = true;
        this.getRandomNumber();
      }
    }
  },
  created() {
    this.buildArr();
    this.snakerArr.push({ row: Math.floor(this.row / 2), column: 0 });
    this.allArr[Math.floor(this.row / 2)][0].showBlack = true;
    this.getRandomNumber();
    let that = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      let direction = "";
      if (key == 37) {
        that.newDirection = "左";
      } else if (key == 38) {
        that.newDirection = "上";
      } else if (key == 39) {
        that.newDirection = "右";
      } else if (key == 40) {
        that.newDirection = "下";
      }
      console.log(!that.timer, "????");
      if (!that.timer) {
        that.snakerLiveState = "live";
        console.log(that.newDirection, "只走一次");
        that.timer = setInterval(
          function(that) {
            // //首先生成食物（在页面上没有食物的时候生成食物）
            // if (!that.food.row) {
            //   that.getRandomNumber();
            // }
            //蛇按照指定方向移动1格
            //预计要走到的坐标（最最初略的计算，哪怕是负数也算出来，后边处理）
            let headProphesy = that.makeHeadProphesy(that.newDirection);
            //判断边界值和是否是无效操作
            if (that.judgeBoundary(headProphesy)) {
              //将这次的移动方向记录
              that.direction = that.newDirection;
              //如果吃到食物，蛇数组第一位变成食物
              if (
                headProphesy.row == that.food.row &&
                headProphesy.column == that.food.column
              ) {
                that.snakerArr.splice(0, 0, headProphesy);
                that.allArr[headProphesy.row][
                  headProphesy.column
                ].showBlack = true;
                //生成新的食物
                that.getRandomNumber();
              } else {
                //如果没吃到食物，就正常行进
                that.snakerArr.splice(0, 0, headProphesy);
                console.log(
                  JSON.parse(JSON.stringify(that.snakerArr)),
                  "???",
                  "第一次跑这里了啊？"
                );
                that.allArr[headProphesy.row][
                  headProphesy.column
                ].showBlack = true;
                that.allArr[that.snakerArr[that.snakerArr.length - 1].row][
                  that.snakerArr[that.snakerArr.length - 1].column
                ].showBlack = false;
                that.snakerArr.splice(that.snakerArr.length - 1, 1);
              }
            } else {
              console.log("走到这里了，相反的操作");
              //此次为无效操作，或者为致死操作,这里只考虑无效操作的情况，致死操作直接交给监听解决。如果是无效操作，那么蛇的行进方向不变
              let newheadProphesy = that.makeHeadProphesy(that.direction);
              //如果蛇没死
              if (that.judgeBoundary(newheadProphesy)) {
                //如果吃到食物，蛇数组第一位变成食物
                if (
                  newheadProphesy.row == that.food.row &&
                  newheadProphesy.column == that.food.column
                ) {
                  that.snakerArr.splice(0, 0, newheadProphesy);
                  that.allArr[newheadProphesy.row][
                    newheadProphesy.column
                  ].showBlack = true;
                  //生成新的食物
                  that.getRandomNumber();
                } else {
                  console.log(headProphesy, "???", "第二次跑这里了啊？");
                  //如果没吃到食物，就正常行进
                  that.snakerArr.splice(0, 0, newheadProphesy);
                  that.allArr[newheadProphesy.row][
                    newheadProphesy.column
                  ].showBlack = true;
                  that.allArr[that.snakerArr[that.snakerArr.length - 1].row][
                    that.snakerArr[that.snakerArr.length - 1].column
                  ].showBlack = false;
                  that.snakerArr.splice(that.snakerArr.length - 1, 1);
                }
              }
            }
          },
          that.animationTime,
          that
        );
      }
    };
    console.log(this.allArr);
  }
};
</script>
<style scoped>
.box {
  border: 10px double #000;
  display: flex;
  flex-wrap: wrap;
}
.pixel {
}
.pixelline {
  display: flex;
}
</style>