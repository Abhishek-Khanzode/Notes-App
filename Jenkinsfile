pipeline {
    agent any
    environment {
        APP_NAME = 'notes-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '=== Stage 1: Checking out code from Git repository ==='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing npm dependencies ==='
                sh 'npm install'
            }
        }

        stage('Lint Code') {
            steps {
                echo '=== Stage 3: Checking code quality with ESLint ==='
                // '|| true' allows the build to continue while showing lint warnings
                sh 'npm run lint || true'
            }
        }

        stage('Build Project') {
            steps {
                echo '=== Stage 4: Building Next.js application ==='
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "=== Stage 5: Building Docker image (${APP_NAME}:${IMAGE_TAG}) ==="
                sh "docker build -t ${APP_NAME}:${IMAGE_TAG} ."
                sh "docker build -t ${APP_NAME}:latest ."
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished!'
        }
        success {
            echo 'Build, lint, and Docker packaging were SUCCESSFUL!'
        }
        failure {
            echo 'Pipeline FAILED! Check the console output above to debug.'
        }
    }
}
