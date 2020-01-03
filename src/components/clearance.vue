<template>
  <div class="box" :style="{width:cardColumn*34+'px',height:cardRow*34+'px'}">
    <div
      :style="{width:cardColumn*34+'px'}"
      class="pixelline"
      v-for="(item,index) in allArr"
      :key="index"
    >
      <div
        class="smallBox"
        v-for="(item1,index1) in item"
        :key="index1"
        @mousedown="mousedown($event,index,index1)"
        @mouseup="mouseup(index,index1)"
        :style="{background:item1.overturn||item1.AshPlacing?'#ccc':'#fff'}"
      >{{item1.overturn?item1.nearby==9?'雷':item1.nearby==0?"":item1.nearby:""}}{{item1.isFlag?"旗":""}}</div>
    </div>
    <button style="margin-top:10px;" @click="again">重新开始</button>
  </div>
</template>

<script>
export default {
  props: {
    //有几行
    row: {
      type: Number,
      default: 10
    },
    //有几列
    column: {
      type: Number,
      default: 10
    },
    //地雷数
    mine: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      //所有数组
      allArr: [],
      //开局随机布雷的数量
      mineNumber: 0,
      //左键按下时
      mouseLeftDown: false,
      //右键按下时
      mouseRightDown: false,
      //游戏状态
      gameType: "live"
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
            //是否已经被翻开
            overturn: false,
            //这个格子附近有几个雷/如果是9就代表它自己是雷
            nearby: 0,
            //这个格子标记为旗子
            isFlag: false,
            //置灰
            AshPlacing: false
          });
        }
      }
    },
    //获取随机数
    getRandomNumber() {
      let mineRow = Math.floor(Math.random() * this.row);
      let mineColumn = Math.floor(Math.random() * this.column);
      if (this.allArr[mineRow][mineColumn].nearby == 9) {
        return;
      } else {
        this.allArr[mineRow][mineColumn].nearby = 9;
        this.mineNumber++;
      }
    },
    computedMine(row, column) {
      if (this.allArr[row][column].nearby == 9) {
        return 9;
      }
      let num = 0;
      let arr = this.getNine(row, column);
      arr.forEach(item => {
        //符合规则的全算一遍
        if (
          item[0] >= 0 &&
          item[0] < this.row &&
          item[1] >= 0 &&
          item[1] < this.column
        ) {
          if (this.allArr[item[0]][item[1]].nearby == 9) {
            num++;
          }
        }
      });
      return num;
    },
    //获取当前row,column的周围八格坐标
    getNine(row, column) {
      return [
        [row - 1, column - 1],
        [row - 1, column],
        [row - 1, column + 1],
        [row, column - 1],
        [row, column + 1],
        [row + 1, column - 1],
        [row + 1, column],
        [row + 1, column + 1]
      ];
    },
    mousedown(e, row, column) {
      if (this.gameType == "die") {
        this.mouseLeftDown = false;
        this.mouseRightDown = false;
        return;
      }
      //console.log(e,row,column,arguments)
      if (e.which == 1) {
        this.mouseLeftDown = true;
      }
      if (e.which == 3) {
        this.mouseRightDown = true;
      }
      //探测
      if (this.mouseLeftDown && this.mouseRightDown) {
        console.log("进来了");
        this.survey(row, column);
      }
    },
    //鼠标抬起
    mouseup(row, column) {
      if (this.mouseLeftDown && this.mouseRightDown) {
        let arr = this.getNine(row, column);
        //附近没开的格子只置灰不显示数字
        arr.forEach(item => {
          if (
            item[0] >= 0 &&
            item[0] < this.row &&
            item[1] >= 0 &&
            item[1] < this.column
          ) {
            //置灰
            this.allArr[item[0]][item[1]].AshPlacing = false;
          }
        });
      }
      //选中
      if (this.mouseLeftDown && !this.mouseRightDown) {
        this.chouse(row, column);
      }
      //插旗
      if (!this.mouseLeftDown && this.mouseRightDown) {
        if (this.allArr[row][column].overturn) {
          return;
        } else {
          this.allArr[row][column].isFlag = !this.allArr[row][column].isFlag;
        }
      }
      this.mouseLeftDown = false;
      this.mouseRightDown = false;
    },
    again() {
      //造二位数组
      this.buildArr();
      while (this.mineNumber < this.mine) {
        this.getRandomNumber();
      }
      //所有的位置代表的数计算
      this.allArr.forEach((item, index) => {
        item.forEach((item1, index2) => {
          item1.nearby = this.computedMine(index, index2);
        });
      });
    },
    chouse(row, column) {
      if (
        this.allArr[row][column].overturn ||
        this.allArr[row][column].isFlag
      ) {
        return;
      } else {
        this.allArr[row][column].overturn = true;
        if (this.allArr[row][column].nearby == 9) {
          this.gameType = "die";
        } else if (this.allArr[row][column].nearby == 0) {
          let arr = this.getNine(row, column);
          arr.forEach(item => {
            if (
              item[0] >= 0 &&
              item[0] < this.row &&
              item[1] >= 0 &&
              item[1] < this.column
            ) {
              console.log(item[0], item[1],"chuse")
              this.chouse(item[0], item[1]);

            }
          });
        }
      }
    },
    //探测具体操作
    survey(row, column) {
      let arr = this.getNine(row, column);
      if (this.allArr[row][column].nearby == 0) {
        if (
          arr.every(item => {
            if (
              item[0] >= 0 &&
              item[0] < this.row &&
              item[1] >= 0 &&
              item[1] < this.column
            ) {
              return (
                this.allArr[item[0]][item[1]].overturn ||
                this.allArr[item[0]][item[1]].isFlag
              );
            } else {
              return true;
            }
          })
        ) {
          return;
        }
      }
      if (this.allArr[row][column].overturn) {
        let num = 0;
        arr.forEach(item => {
          if (
            item[0] >= 0 &&
            item[0] < this.row &&
            item[1] >= 0 &&
            item[1] < this.column
          ) {
            //如果周围八个格子里有旗子，计算旗子总数
            if (this.allArr[item[0]][item[1]].isFlag) {
              num++;
            }
          }
        });
        //如果雷都预判了，直接全点开
        if (num == this.allArr[row][column].nearby) {
          arr.forEach(item => {
            if (
              item[0] >= 0 &&
              item[0] < this.row &&
              item[1] >= 0 &&
              item[1] < this.column
            ) {
              // //直接打开
              // if (
              //   !this.allArr[item[0]][item[1]].isFlag &&
              //   !this.allArr[item[0]][item[1]].overturn
              // ) {
              //   console.log(item[0], item[1], "打开了");
              //   this.allArr[item[0]][item[1]].overturn = true;
              // }

              if (
                this.allArr[item[0]][item[1]].nearby == 9 &&
                !this.allArr[item[0]][item[1]].isFlag
              ) {
                this.gameType = "die";
              }
              //如果九格内没有炸弹，直接再调用再重新调用
              //if (this.allArr[item[0]][item[1]].nearby == 0) {
                console.log("chongxin diaoyong");
                this.chouse(item[0], item[1]);
              //}
            }
          });
        } else {
          //附近没开的格子只置灰不显示数字
          arr.forEach(item => {
            if (
              item[0] >= 0 &&
              item[0] < this.row &&
              item[1] >= 0 &&
              item[1] < this.column
            ) {
              //置灰
              if (!this.allArr[item[0]][item[1]].isFlag) {
                this.allArr[item[0]][item[1]].AshPlacing = true;
              }
            }
          });
        }
      } else {
        //附近没开的格子只置灰不显示数字
        arr.forEach(item => {
          if (
            item[0] >= 0 &&
            item[0] < this.row &&
            item[1] >= 0 &&
            item[1] < this.column
          ) {
            //置灰
            if (!this.allArr[item[0]][item[1]].isFlag) {
              this.allArr[item[0]][item[1]].AshPlacing = true;
            }
          }
        });
      }
    }
  },
  computed: {
    cardRow: function() {
      return this.row;
    },
    cardColumn: function() {
      return this.column;
    }
  },
  watch: {
    gameType: function(val) {
      if (val == "die") {
        this.allArr.forEach(item => {
          item.forEach(item1 => {
            item1.overturn = true;
            item1.isFlag = false;
          });
        });
      } else {
        console.log("aaaa");
        //造二位数组
        this.buildArr();
        while (this.mineNumber < this.mine) {
          this.getRandomNumber();
        }
        //所有的位置代表的数计算
        this.allArr.forEach((item, index) => {
          item.forEach((item1, index2) => {
            item1.nearby = this.computedMine(index, index2);
          });
        });
      }
    }
  },
  created() {
    document.oncontextmenu = function() {
      return false;
    };
    this.again();
  }
};
</script>

<style scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}
.smallBox {
  width: 30px;
  height: 30px;
  margin-left: 1px;
  border: 1px solid #000;
  line-height: 30px;
  text-align: center;
}
.pixelline {
  display: flex;
}
.smallBox:hover {
  background-color: dodgerblue;
}
</style>
