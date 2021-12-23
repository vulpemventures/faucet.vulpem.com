# Faucet


## Deployment 


### Build the image
```bash
docker build -t <aws_account_id>.dkr.ecr.<aws_region>.amazonaws.com/lambda-faucet:latest .
```

### Login to ECR 
```bash
aws ecr get-login-password --region <aws_region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<aws_region>.amazonaws.com
```

### Push to ECR
```bash
docker push <aws_account_id>.dkr.ecr.<aws_region>.amazonaws.com/lambda-faucet:latest         
```

### Update Lambda image

```bash
aws lambda update-function-code \ 
    --region <aws_region> \
    --function-name liquid-testnet-faucet \
    --image-uri <aws_account_id>.dkr.ecr.<aws_region>.amazonaws.com/lambda-faucet:latest
```
