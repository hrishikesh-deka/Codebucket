# ECS Deployment Instructions

## 1. Architecture Overview
This application is deployed on Amazon ECS using AWS Fargate. It consists of three main containers:
- **frontend-nginx**: Serves the static react build and reverse-proxies API calls using `localhost:3000`.
- **backend**: Node.js/Python server managing business logic.
- **db**: PostgreSQL database container.

## 2. Prerequisites
- Docker desktop or daemon running.
- AWS CLI installed and configured.
- Sufficient IAM permissions to create ECR repositories and ECS tasks.

## 3. Step-by-step deployment instructions

1. Set up your appropriate `ACCOUNT_ID` in `build-and-push-ecs.sh` and `ecs-task-prod.json`.
2. Run the push script:
   ```bash
   ./build-and-push-ecs.sh
   ```

## 4. How to build and push images
The included script handles this automatically via the `aws ecr` commands.

## 5. How to register task definition
Register the generated task definition using AWS CLI:
```bash
aws ecs register-task-definition --cli-input-json file://ecs-task-prod.json
```

## 6. How to create/update ECS service
Attach to your desired cluster and service using:
```bash
aws ecs update-service --cluster MyCluster --service MyService --task-definition app-prod-task
```

## 7. Troubleshooting section
If you encounter `CannotPullContainerError`, verify if the ECR registry URI is completely correct in the `ecs-task-prod.json` tasks container map.

## 8. Monitoring and logging instructions
Configure AWS Firelens and Cloudwatch through standard CloudWatch Log Streams or fluentbit.
