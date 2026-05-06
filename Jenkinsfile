// Complete CI/CD Pipeline for Local Setup
// Works with Docker-based Jenkins

pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'yogisre12345'
        IMAGE_TAG = 'test-latest'
        // Docker inside Docker - host docker use karo
        DOCKER_HOST = 'tcp://host.docker.internal:2375'
    }
    
    triggers {
        // Poll SCM every 5 minutes
        pollSCM('H/5 * * * *')
    }
    
    stages {
        stage('📥 Checkout') {
            steps {
                checkout scm
                echo '✅ Code checked out from GitHub'
                
                // Show commit info
                bat '''
                    echo Last commit:
                    git log -1 --oneline
                '''
            }
        }
        
        stage('🔨 Build Docker Images') {
            steps {
                script {
                    // Build all images
                    echo 'Building Backend...'
                    bat 'docker build -t %DOCKER_REGISTRY%/simple-fullstack-app-backend:%IMAGE_TAG% ./backend'
                    
                    echo 'Building Gateway...'
                    bat 'docker build -t %DOCKER_REGISTRY%/simple-fullstack-app-gateway:%IMAGE_TAG% ./gateway'
                    
                    echo 'Building Frontend...'
                    bat 'docker build -t %DOCKER_REGISTRY%/simple-fullstack-app-frontend:%IMAGE_TAG% ./frontend'
                    
                    echo 'Building Admin...'
                    bat 'docker build -t %DOCKER_REGISTRY%/simple-fullstack-app-admin:%IMAGE_TAG% ./admin'
                }
            }
        }
        
        stage('📤 Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                        echo Logging into Docker Hub...
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        
                        echo Pushing images...
                        docker push %DOCKER_REGISTRY%/simple-fullstack-app-backend:%IMAGE_TAG%
                        docker push %DOCKER_REGISTRY%/simple-fullstack-app-gateway:%IMAGE_TAG%
                        docker push %DOCKER_REGISTRY%/simple-fullstack-app-frontend:%IMAGE_TAG%
                        docker push %DOCKER_REGISTRY%/simple-fullstack-app-admin:%IMAGE_TAG%
                        
                        echo Images pushed successfully
                    '''
                }
            }
        }
        
        stage('☸️ Deploy to Kind') {
            steps {
                bat '''
                    echo Switching to Kind cluster...
                    kubectl config use-context kind-test-cluster
                    
                    echo Current context:
                    kubectl config current-context
                    
                    echo Restarting deployments...
                    kubectl rollout restart deployment/backend -n test
                    kubectl rollout restart deployment/gateway -n test
                    kubectl rollout restart deployment/frontend -n test
                    kubectl rollout restart deployment/admin -n test
                    
                    echo Waiting for rollouts...
                    kubectl rollout status deployment/backend -n test --timeout=180s
                    kubectl rollout status deployment/gateway -n test --timeout=180s
                    kubectl rollout status deployment/frontend -n test --timeout=180s
                    kubectl rollout status deployment/admin -n test --timeout=180s
                    
                    echo Deployment completed
                '''
            }
        }
        
        stage('✅ Verify') {
            steps {
                bat '''
                    echo === Pod Status ===
                    kubectl get pods -n test
                    
                    echo.
                    echo === Deployment Status ===
                    kubectl get deployments -n test
                    
                    echo.
                    echo CI/CD Pipeline Complete!
                '''
            }
        }
    }
    
    post {
        success {
            echo '''
╔════════════════════════════════════════════════╗
║     CI/CD PIPELINE SUCCESSFUL!                 ║
║                                                ║
║  Flow: GitHub -> Jenkins -> Docker Hub -> Kind ║
╚════════════════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
╔════════════════════════════════════════════════╗
║     CI/CD PIPELINE FAILED                      ║
║                                                ║
║  Check logs above for errors                   ║
╚════════════════════════════════════════════════╝
            '''
        }
    }
}
