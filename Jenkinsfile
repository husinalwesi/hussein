pipeline {
    agent any
    tools {nodejs "node"}

    stages {
        stage('prebuild') {
            steps {
                sh 'ls -la'
                sh 'export PATH=~/local/bin:$PATH'
                sh 'npm -v && node -v'
            }
        }
        stage('build') {
            steps {
                sh 'rm -rf package-lock.json'
                sh 'yarn install'
                sh 'yarn run build'
            }
        }
        stage('deploy') {
            steps {
                withAWS(credentials:'dev-lec-globalsnow-aws-keys') {
                    sh 'aws s3 sync ./dist/ s3://lec-global-snow-cdn/'
                    sh 'aws s3 ls s3://lec-global-snow-cdn/'
                }
            }
        }
    }
    post {
        success {
            cleanWs()
        }
    }
}
