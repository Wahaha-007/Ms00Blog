1. to build image into K8s env.
   eval $(minikube docker-env)
   docker build -t wahaha007/posts:0.0.1 .

2. Use curl for POST ( Postman doesn't available in WSL text mode )
   # minikube ip
   192.168.49.2
   # k get services
   posts-srv NodePort 10.99.251.231 <none> 4000:32353/TCP 4h50m

curl -d '{"title":"POST"}' -H "Content-Type: application/json" -X POST http://192.168.49.2:32353/posts
ref : https://gist.github.com/subfuzion/08c5d85437d5d4f00e58
