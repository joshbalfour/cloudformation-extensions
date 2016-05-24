
console.log('Loading event');
 
var aws = require('aws-sdk');
 
exports.handler = function(event, context) {
  var ecsService = "<%cfnex { 'Ref' : 'serviceAppService' } cfnex%>";
  var ecsRegion = "<%cfnex{ 'Ref' : 'AWS::Region' } cfnex%>";
  var maxCount = "<%cfnex { 'Ref' : 'AsgMaxSize' } cfnex%>";
 
  var ecs = new aws.ECS({region: ecsRegion});
  ecs.describeServices({services:[ecsService]}, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var desiredCount = data.services[0].desiredCount;
      if (desiredCount < maxCount) {
        desiredCount++;
        var params = {
          service:      ecsService,
          desiredCount: desiredCount
        };
        ecs.updateService(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data);
            context.succeed();
          }
        });
      } else {
        console.log('Service count is already max.');
        context.fail();
      }
    }
  });
};
 
