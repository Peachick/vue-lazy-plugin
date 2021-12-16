<template>
  <div id="app">
    <button @click="createBase"> 生成base64 </button>

    <div>
      <img v-lazy="'https://s4.ax1x.com/2021/12/15/TS7e29.gif'" alt="">
    </div>

    <div>
      <img v-lazy="'/a1.jpg'" alt="出错了...">
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <div>
      <img width="200" height="200" v-lazy="{ src: '/adad.png', error: 'https://s4.ax1x.com/2021/12/15/TSbQhD.jpg' }">
    </div>
    <br><br><br><br><br><br><br><br><br><br>
    <div>
      <img v-lazy="{ src: 'https://s4.ax1x.com/2021/12/15/TSHmFS.jpg', loading: 'https://s4.ax1x.com/2021/12/15/TSHo0P.gif' }">
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <div>
      <img v-lazy="'https://s4.ax1x.com/2021/12/15/TS67nJ.jpg'" width="600">
    </div>
    <br><br><br><br><br><br><br><br><br>
    <div>
      <div
        v-lazy:backgroundImage="{src: 'https://s4.ax1x.com/2021/12/15/TScWbd.jpg', loading: '/default-loading.gif'}"
        class="back-img"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class App extends Vue {

  createBase() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()
    input.onchange = function() {
      const file = (this as any).files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = function(e: any) {
        console.log(e.target.result)
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.back-img {
  margin: 0 auto;
  width: 600px;
  height: 800px;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
}
</style>
