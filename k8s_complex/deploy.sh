
docker build -t soramon0/complex_client:latest -t soramon0/complex_client:$SHA -f ./client/Dockerfile ./client
docker build -t soramon0/complex_server:latest -t soramon0/complex_server:$SHA -f ./server/Dockerfile ./server
docker build -t soramon0/complex_worker:latest -t soramon0/complex_worker:$SHA -f ./worker/Dockerfile ./worker

docker push soramon0/complex_client
docker push soramon0/complex_client
docker push soramon0/complex_worker
docker push soramon0/complex_client:$SHA
docker push soramon0/complex_client:$SHA
docker push soramon0/complex_worker:$SHA

kubectl apply -f k8s
kubectl set image deployment/server-deployment server=soramon0/complex_server:$SHA
kubectl set image deployment/client-deployment client=soramon0/complex_client:$SHA
kubectl set image deployment/worker-deployment worker=soramon0/complex_worker:$SHA