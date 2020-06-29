React.Component.prototype.setState = function(partialState, callback){
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
}

// inst 传入的this  payload 更新的对象 callback 回调函数
function enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst);// this._reactInternalFiber 获取FiberNode
    const currentTime = requestCurrentTimeForUpdate(); // 得到当前时间
    const suspenseConfig = requestCurrentSuspenseConfig();
    const expirationTime = computeExpirationForFiber( // 获取过期时间
      currentTime,
      fiber,
      suspenseConfig,
    );

    const update = createUpdate(expirationTime, suspenseConfig);//创建更新任务
    update.payload = payload;// 需要更新的呢绒
    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);//加入当前Fiber的更新队列 环形链表
    scheduleWork(fiber, expirationTime);
}
Component.prototype.forceUpdate = {} //只是更新任务的tag换为forceUpdate
