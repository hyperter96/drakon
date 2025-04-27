package com.drakon;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.theweflex.react.WeChatModule;

public class DrakonWeChatModule extends WeChatModule {
    private static final String TAG = "DrakonWeChatModule";

    public DrakonWeChatModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void onReq(com.tencent.mm.opensdk.modelbase.BaseReq baseReq) {
        super.onReq(baseReq);
    }

    @Override
    public void onResp(com.tencent.mm.opensdk.modelbase.BaseResp baseResp) {
        super.onResp(baseResp);
        Log.d(TAG, "微信回调: " + baseResp.errStr + ", code: " + baseResp.errCode);
    }

    /**
     * 添加发送微信事件支持
     * @param eventName 事件名称
     * @param params 事件参数
     */
    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
} 