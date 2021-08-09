if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then

export BUILD_DATE=`date "+%Y/%m/%d@%H:%M:%S"`
cp "$APPCENTER_OUTPUT_DIRECTORY/$APPCENTER_XCODE_SCHEME.ipa" "./${APPCENTER_XCODE_SCHEME}-${APPCENTER_BRANCH}-${APPCENTER_BUILD_ID}.ipa"

ls

curl \
  -F file="@${APPCENTER_XCODE_SCHEME}-${APPCENTER_BRANCH}-${APPCENTER_BUILD_ID}.ipa" \
  -F channels=$CHANNEL_SLACK \
  -F "initial_comment=Appcenter Build on $BUILD_DATE" \
  -H "Authorization: Bearer $AUTH_SLACK_BOT" \
   https://slack.com/api/files.upload
fi

