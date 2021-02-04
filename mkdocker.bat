


docker build --no-cache ./apiDados -t api --network=host
echo 'Tagging'
docker tag api:latest a82298/api:2021-01-23
echo 'Pushing'
docker push a82298/api:2021-01-23
echo 'Terminado'
echo 'Id da imagem no DHub: a82298/api:2021-01-23'


docker build ./interface -t interface
echo 'Tagging'
docker tag interface:latest a82298/interface:2021-01-23
echo 'Pushing'
docker push a82298/interface:2021-01-23
echo 'Terminado'
echo 'Id da imagem no DHub: a82298/interface:latest'
