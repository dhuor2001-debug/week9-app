pipeline {
    agent any

environment {
    DOCKER_HOST = 'tcp://localhost:2375'
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    IMAGE_NAME = 'richieit/sportswear-store'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
}

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% -t %IMAGE_NAME%:latest ."
            }
        }

        stage('Docker Push') {
    steps {
        bat "docker login -u %DOCKERHUB_CREDENTIALS_USR% -p %DOCKERHUB_CREDENTIALS_PSW%"
        bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
        bat "docker push %IMAGE_NAME%:latest"
    }
}
    post {
        always {
            bat 'docker logout'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
}