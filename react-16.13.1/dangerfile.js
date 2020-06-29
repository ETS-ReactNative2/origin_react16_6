const NoWork = 0;
const Sync = 1;
const Never = Math.pow(2, 30) - 1;

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

// 计算当前时间 now/10 + 2 以10为单位并增加一个偏移量
function msToExpirationTime(ms){
    return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}


// 返回时间对应的时间戳 反向计算
function expirationTimeToMs(expirationTime){
    return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

// [(now+150)/100 + 1] * (100/10) = (now + 150)/10 + 10
function ceiling(num, precision){// (now + 150)/10    100/10
    return (((num / precision) | 0) + 1) * precision;
}


function computeExpirationBucket(
    currentTime,
    expirationInMs,//150
    bucketSizeMs,//100
  ){
    return (
      MAGIC_NUMBER_OFFSET +
      ceiling(
        currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE,// (now/10 + 2) - 2 + 150/10   (now + 150)/10
        bucketSizeMs / UNIT_SIZE,// 100/10
      )
    );
}

//计算异步任务过期时间
function computeAsyncExpiration(currentTime){
    return computeExpirationBucket(
      currentTime,
      5000,//LOW_PRIORITY_EXPIRATION
      250,//LOW_PRIORITY_BATCH_SIZE
    );
}

//计算交互任务过期时间  100ms以内的都忽略按照以10为单位的上限算 并增加150ms的偏移量
function computeInteractiveExpiration(currentTime){ //当前时间戳 偏移150后/10 + 10
    return computeExpirationBucket(
        currentTime,
        150,//HIGH_PRIORITY_EXPIRATION
        100,//HIGH_PRIORITY_BATCH_SIZE
    );
}
//[(now+150)/100 + 1] * (100/10) 
console.log(computeInteractiveExpiration(msToExpirationTime(1350)))//  162
console.log(computeInteractiveExpiration(msToExpirationTime(1350 + 99)))// 162
console.log(computeInteractiveExpiration(msToExpirationTime(1350 + 100)))// 172