#!/bin/bash
echo ECS_CLUSTER=<%cfnex { "Ref": "EcsCluster" } cfnex%>  >> /etc/ecs/ecs.config
