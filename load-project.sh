# this is for switching projects, supply with project name and environment
# i.e. ./load-project.sh project staging

# it requires a .env.(project).(environment) and an app icon in the format (project).png
# if it isn't found, it will generate one


echo loading $1 $2

if [ ! -f ./.env.$1.$2 ]; then
    echo ".env.$1.$2 not found!"
    echo " generating blank .env.$1.$2"
    node generate-env.js $1 $2
    return 1
fi

cp .env.$1.$2 .env

npm run setup-files
npm run clear-cache:web
IMAGE=$1.png npm run setup-images
