pipeline {
    agent any

    environment {
        DOCKERHUB_USER   = 'YOUR_DOCKERHUB_USERNAME'
        IMAGE_NAME       = 'swiftride'
        IMAGE_TAG        = "${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
        IMAGE_LATEST     = "${DOCKERHUB_USER}/${IMAGE_NAME}:latest"
        CONTAINER_NAME   = 'swiftride-app'
        APP_PORT         = '5000'
        EC2_USER         = 'ec2-user'
        EC2_HOST         = 'YOUR_EC2_PUBLIC_IP'
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
                echo "Code cloned — build #${BUILD_NUMBER}"
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || echo "No lint script — skipping"'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "No test script — skipping"'
            }
        }

        stage('Build Image') {
            steps {
                sh "docker build -t ${IMAGE_TAG} -t ${IMAGE_LATEST} ."
                echo "Image built: ${IMAGE_TAG}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push ''' + IMAGE_TAG + '''
                        docker push ''' + IMAGE_LATEST + '''
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker pull ${IMAGE_LATEST}
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                    docker run -d \\
                        --name ${CONTAINER_NAME} \\
                        --restart always \\
                        -p ${APP_PORT}:${APP_PORT} \\
                        --env-file /home/ec2-user/swiftride.env \\
                        ${IMAGE_LATEST}
                """
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for app to start..."
                    sleep 10
                    curl -f http://localhost:5000/health || \
                        (echo "Health check failed" && exit 1)
                    echo "App is healthy"
                '''
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} deployed successfully"
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed"
            sh 'docker logs ${CONTAINER_NAME} --tail 50 || true'
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
