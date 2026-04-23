pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io/yogisre12345'
        IMAGE_NAME = 'simple-fullstack-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo "Building application for feature branch..."
                    
                    // Build Docker images
                    sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:feature-${BUILD_NUMBER} ./backend'
                    sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:feature-${BUILD_NUMBER} ./gateway'
                    sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:feature-${BUILD_NUMBER} ./frontend'
                }
            }
        }
        
        stage('Validate') {
            steps {
                script {
                    echo "Running basic validation..."
                    
                    // Run basic tests
                    sh 'docker-compose -f docker-compose.test.yml up --build'
                    sh 'docker-compose -f docker-compose.test.yml down'
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    echo "Running security scan..."
                    
                    // Basic security scan
                    sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_REGISTRY}/${IMAGE_NAME}:feature-${BUILD_NUMBER}'
                }
            }
        }
    }
    
    post {
        always {
            echo "Feature pipeline completed - no deployment"
        }
        success {
            echo "Feature branch built and validated successfully"
        }
        failure {
            echo "Feature pipeline failed - check logs"
        }
    }
}
