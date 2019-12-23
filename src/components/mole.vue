<template>
  <div
    :style="{width:cardColumn*300+'px',height:cardRow*300+'px'}"
    class="bg"
    @mousedown="bgmouseDown"
    @mouseup="bgmouseUp"
    id="bg"
  >
    <div class="mouseBox" :style="{top:(300*uprow+130)+'px',left:(300*upcolumn+75)+'px'}">
      <img
        :src="mouseImg"
        class="mouse"
        style="position:relative"
        :style="{top:mouseY + 'px'}"
        @click="killMouse"
      />
    </div>
    <div class="smallBox" v-for="(item,index) in (cardRow*cardColumn)" :key="index">
      <div class="strike"></div>
      <div class="burrow"></div>
    </div>
  </div>
</template>

<script>
import bg from "@/public/images/bg.jpg";
import cursorDown from "@/public/images/cursor-down.png";
import cursor from "@/public/images/cursor.png";
import hole from "@/public/images/hole.png";
import mouse from "@/public/images/mouse.png";
import cryMouse from "@/public/images/cryMouse.png";
export default {
  name: "HelloWorld",
  props: {
    //有几行洞
    row: {
      type: Number,
      default: 3
    },
    //有几列洞
    column: {
      type: Number,
      default: 3
    },
    //地鼠从露头到缩回去总用时
    animationTime: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      //背景
      bg: bg,
      //鼠标按下
      cursorDown: cursorDown,
      //鼠标
      cursor: cursor,
      //洞
      hole: hole,
      //大老鼠
      mouse: mouse,
      //哭的大老鼠
      cryMouse: cryMouse,
      //定时器
      moleTimeInterval: null,
      //当前正在出老鼠的行
      uprow: "",
      //当前正在出老鼠的列
      upcolumn: "",
      //土拨鼠冒头的定时器
      moleUpInterval: null,
      //老鼠的top高度
      mouseY: 140,
      //老鼠是在冒头还是在往回缩
      mouseMoveState: "up",
      //打地鼠的分数
      mark: 0,
      //地鼠的生存状态
      mouseLiveState: "live",
      //显示的老鼠图片
      mouseImg: mouse
    };
  },
  methods: {
    //获取随机数
    getRandomNumber() {
      this.uprow = Math.floor(Math.random() * this.row);
      this.upcolumn = Math.floor(Math.random() * this.column);
    },
    //土拨鼠向上的函数
    mouseUp() {
      clearInterval(this.moleUpInterval);
      this.moleUpInterval = setInterval(
        function(that) {
          if (that.mouseY < 0) {
            that.mouseMoveState = "down";
          }
          if (that.mouseMoveState == "up") {
            that.mouseY = that.mouseY - 2;
          } else {
            that.mouseY = that.mouseY + 2;
          }
        },
        this.animationTime / 140,
        this
      );
    },
    //点击到地鼠事件
    killMouse() {
      if (this.mouseLiveState == "live") {
        //当前地鼠被点击相当于地鼠被干掉了，所以不能重复点击，将其标记为死亡。
        this.mouseLiveState = "die";
        //加分
        this.mark += 10;
        //把图片换成哭的
        this.mouseImg = this.cryMouse;
        //清除移动老鼠的定时器，让老鼠停止移动
        clearInterval(this.moleUpInterval);
      }
    },
    //鼠标按下在游戏页面里
    bgmouseDown() {
      document.getElementById(
        "bg"
      ).style.cssText = `cursor:url(${cursor}), default;width:${this
        .cardRow * 300}px;height:${this.cardColumn * 300}px;`;
    },
    //鼠标抬起在游戏页面里
    bgmouseUp() {
      document.getElementById(
        "bg"
      ).style.cssText = `cursor:url(${cursorDown}), default;width:${this.cardRow *
        300}px;height:${this.cardColumn * 300}px;`;
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
  created() {
    this.getRandomNumber();
    this.mouseY = 140;
    this.mouseMoveState = "up";
    this.mouseUp();
    this.moleTimeInterval = setInterval(
      function(that) {
        that.getRandomNumber();
        //老鼠的位置重置
        that.mouseY = 140;
        //老鼠的状态变回上升
        that.mouseMoveState = "up";
        //老鼠又复活了
        that.mouseLiveState = "live";
        //图片换回不哭的老鼠
        that.mouseImg = that.mouse;
        that.mouseUp();
      },
      this.animationTime,
      this
    );
  }
};
</script>

<style scoped>
.bg {
  background-image: url(../public/images/bg.jpg);
  display: flex;
  flex-wrap: wrap;
  cursor: url(../public/images/cursor-down.png), default;
}
.smallBox {
  width: 300px;
  height: 300px;
}
.burrow {
  width: 300px;
  height: 150px;
  /* background-image: url(../public/images/hole.png) no-repeat center center; */
  background: url(../public/images/hole.png) no-repeat center top;
}
.strike {
  height: 150px;
  width: 150px;
  margin-left: 75px;
}
.mouseBox {
  width: 160px;
  height: 140px;
  position: absolute;
  overflow: hidden;
}
.mouse {
  width: 160px;
  height: 140px;
}
</style>
