package com.mytestapppay.service;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.reactnativethalespaysdkwrapper.app.AppConstants;
import com.reactnativethalespaysdkwrapper.payment.contactless.pfp.PFPHelper;
import com.reactnativethalespaysdkwrapper.util.AppLogger;
import com.reactnativethalespaysdkwrapper.util.SDKHelper;
import com.reactnativethalespaysdkwrapper.util.SharedPreferenceUtils;

import java.util.Map;


public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = MyFirebaseMessagingService.class.getSimpleName();
    private static final String FIREBASE_ID = "firebase_id";

    @Override
    public void onNewToken(@NonNull String s) {
        super.onNewToken(s);
        Log.i(TAG,"Token Refresh is "+s);
        SharedPreferenceUtils.setFirebaseId(this,s);
       //Firebase API has limitation when there are multiple sender ID, the onNewToken is triggered only for default SENDER_ID.
        // So it is prudent to check for updatePushToken regularly after SDK initialization as well.
        //And it is prudent to check for updatePushToken just before card enrollment process begin as well.
        SDKHelper.updateFirebaseToken(this.getApplicationContext());
    }



    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        AppLogger.d(TAG, remoteMessage.getData().toString());

        PFPHelper.INSTANCE.initSDKs(MyFirebaseMessagingService.this.getApplicationContext(),false);

        super.onMessageReceived(remoteMessage);

        Bundle bundle = new Bundle();
        Map<String, String> data = remoteMessage.getData();
        if (data == null) {
            //We are only handling data messages from FCM.
            //Not interested in other types of messages.
            return;
        }
       // if( data.containsKey("sender") && data.containsKey("action"))

        String sender = "";
        String action = "";
        String digitalCardID = "";
        if (!data.isEmpty()) {
            for (String key : data.keySet()) {
                AppLogger.d(TAG, key + " ---|--- " + data.get(key));

                if (null != data.get(key)) {
                    bundle.putString(key, data.get(key));
                    if (key.equalsIgnoreCase("sender")) {
                        sender = data.get(key);
                    }
                    if (key.equalsIgnoreCase("action")) {
                        action = data.get(key);
                    }
                    if (key.equalsIgnoreCase("digitalCardID")) {
                        digitalCardID = data.get(key);
                    }

                }

            }
        }
        if (sender.equalsIgnoreCase("CPS")) {
            final String isPushNotiDisabled = SharedPreferenceUtils.isPushNotiDisabled(this.getApplicationContext());

            Log.i(TAG, "action "+ action + "ddigitalCardID "+ digitalCardID);
            if (isPushNotiDisabled.equals("") || isPushNotiDisabled.isEmpty()){

              Intent sendIntent = new Intent(AppConstants.ACTION_START_CPS);
              sendIntent.putExtras(bundle);
              LocalBroadcastManager.getInstance(this).sendBroadcast(sendIntent);

            }

        } else if ("MG".equalsIgnoreCase(sender)) {
            if (action != null && action.equalsIgnoreCase("MG:ReplenishmentNeededNotification")) {
                if (digitalCardID != null && !digitalCardID.isEmpty()) {
                  SDKHelper.forceReplenish(digitalCardID);
                }
            }
        }

    }


}


