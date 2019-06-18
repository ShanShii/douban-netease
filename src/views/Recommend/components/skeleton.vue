<!-- Recommend Skeleton -->
<template>
  <div class="skeleton page">
    <div class="skeleton-nav load-flash"></div>
    <ul class="skeleton-list">
      <li class="skeleton-list-item load-flash"></li>
      <li class="skeleton-list-item load-flash"></li>
      <li class="skeleton-list-item load-flash"></li>
      <li class="skeleton-list-item load-flash"></li>
      <li class="skeleton-list-item load-flash"></li>
      <li class="skeleton-list-item load-flash"></li>
    </ul>

    <div class="skeleton-nav load-flash"></div>
    <ul class="skeleton-tabs">
      <div class="skeleton-tabs-head load-flash"></div>
      <li v-for="i in 3" class="skeleton-tabs-item" :key="i">
        <div class="item-image load-flash"></div>
        <div class="content">
          <div class="item-title load-flash"></div>
          <div class="item-info load-flash"></div>
          <div class="item-info load-flash"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang='scss' scoped>
.load-flash {
  overflow: hidden;
  background-color: rgba(238, 238, 238, 0.95);
  animation: flashLight 2s ease-in infinite;
}
@keyframes flashLight {
  50% {
    background-color: rgba(238, 238, 238, 0.5);
  }
}
.skeleton {
	position: relative;
	height: 100%;
	overflow: hidden;
	padding: 15px;
	box-sizing: border-box;
  * {position: relative;}
}
.skeleton-nav {
  height: 30px;
  margin-bottom: 10px;
}
.skeleton-list {
	display: flex;
	flex-wrap: wrap;
	height: 300px;
	margin-bottom: 10px;
	&-item {
		flex: none;
		width: 30%;
		margin-right: 3.3%;
		margin-bottom: 10px;
	}
}

.skeleton-tabs {
  padding: 0;
  width: 80%;
  &-head {
    height: 140px;
    margin-bottom: 10px;
  }
  &-item {
    display: flex;
    height: 55px;
    box-sizing: border-box;
    text-align: center;
    margin-bottom: 15px;
    .content {
        flex: auto;
        display: flex;
        align-content: space-between;
        flex-wrap: wrap;
        margin-left: 10px;
    }
        .item {
        &-image {
            width: 45px;
            height: 60px;
        }

        &-title {
            height: 20px;
            width: 70%;
        }
        &-info {
            height: 10px;
            width: 51%;
        }
    }
  }
}

// .skeleton-tabs-item span {
//   display: inline-block;
//   width: 55px;
//   height: 55px;
//   border-radius: 55px;
//   background: #eee;
// }
</style>