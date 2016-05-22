module.exports = function([containerName], cb){
	cb(null, [
			{
					"Name": "DB_HOSTNAME",
					"Value": {"Fn::GetAtt" : [ "RDBMS" , "Endpoint.Address" ]}
			},
			{
					"Name": "DB_DATABASE",
					"Value": { "Ref" : "rdbmsDBName"}
			},
			{
					"Name": "DB_USERNAME",
					"Value": { "Ref" : "rdbmsUser" }
			},
			{
					"Name": "DB_PASSWORD",
					"Value": { "Ref" : "rdbmsPass" }
			},
			{
					"Name": "WEB_ENDPOINT",
					"Value": { "Fn::Join" : ["", [ "//", { "Ref" : "s3Bucket" }, "/" ]]}
			},
			{
					"Name": "API_ENDPOINT",
					"Value": { "Fn::Join" : ["", [ "//", { "Ref" : "s3Bucket" }, "/", "api" ]]}
			},
			{
					"Name": "CHAT_ENDPOINT",
					"Value": { "Fn::Join" : ["", [ "//", { "Ref" : "s3Bucket" }, "/", "chat" ]]}
			},
			{
					"Name": "FACEBOOK_CLIENT_ID",
					"Value": {"Ref": "FacebookClientID"}
			},
			{
					"Name": "FACEBOOK_CLIENT_SECRET",
					"Value": {"Ref": "FacebookClientSecret"}
			},
			{
					"Name": "SERVER_FILE",
					"Value": containerName+".js"
			},
			{
					"Name" : "CLOUD_HOST",
					"Value" : "AWS"
			},
			{
					"Name" : "REDIS_CACHE_CLUSTER_ID",
					"Value" : {"Ref" : "redis"}
			},
			{
				"Name" : "SESSION_SECRET",
				"Value" : {"Ref" : "sessionSecret"}
			},
			{
					"Name" : "LOG_FILE_LOCATION",
					"Value" : "/mnt/logs/"+containerName+".log"
			},
			{
					"Name" : "ERROR_LOG_FILE_LOCATION",
					"Value" : "/mnt/logs/"+containerName+".err.log"
			},
			{
				"Name" : "GA_TRACKING_ID",
				"Value" : {"Ref" : "GaTrackingId"}
			},
			{
				"Name" : "SES_ACCESS_KEY",
				"Value":  { "Ref" : "sesUserAccessKey" }
			},
			{
				"Name" : "SES_ACCESS_SECRET",
				"Value" : {
					"Fn::GetAtt" : [ "sesUserAccessKey", "SecretAccessKey" ]
				}
			},
			{
				"Name" : "SES_REGION",
				"Value" : { "Ref": "AWS::Region" }
			},
			{
				"Name" : "SES_SENDER",
				"Value" : { "Fn::Join" : ["", [ { "Ref" : "emailNotificationsFromName" }, " <", {"Ref" : "emailNotificationsFromUser"}, "@", {"Ref" : "s3Bucket"},">" ]]}
			},
			{
				"Name" : "SQS_REGION",
				"Value" : { "Ref": "AWS::Region" }
			},
			{
				"Name" : "SQS_ACCESS_KEY",
				"Value": { "Ref" : "SQSAccessKey" }
			},
			{ 
				"Name" : "SQS_ACCESS_SECRET",
				"Value" : { "Fn::GetAtt" : [ "SQSAccessKey", "SecretAccessKey" ] }
			},
			{
				"Name" : "SQS_QUEUE_URL",
				"Value" : { "Ref" : containerName+"Queue" }
			},
			{
				"Name" : "SNS_REGION",
				"Value" : { "Ref": "AWS::Region" }
			},
			{
				"Name" : "SNS_ACCESS_KEY",
				"Value": { "Ref" : "SNSAccessKey" }
			},
			{ 
				"Name" : "SNS_ACCESS_SECRET",
				"Value" : { "Fn::GetAtt" : [ "SNSAccessKey", "SecretAccessKey" ] }
			},
			{
				"Name" : "SNS_TOPIC_ARN",
				"Value" : { "Ref" : "SystemBusSNSTopic" }
			}
	]);
};