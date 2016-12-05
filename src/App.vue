<template>
<div>
  <div class="head">
      <h1>form 组件 实例</h1>
  </div>
  <div class='container'>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
  import 'bootstrap';
  export default {
    components: {
    },
    ready() {
       
    }
  }
</script>

<style lang='less'>
  @import '~bootstrap/dist/css/bootstrap.min.css'; 
  @import '~bootstrap/dist/css/bootstrap-theme.min.css'; 
  @import '~toastr/build/toastr.min.css';
  .head {
    height: 120px;
    background: #dfe1e8;
    padding: 20px;
    margin-bottom: 30px;
    h1 {
      text-align: center;
    }
  }
</style>