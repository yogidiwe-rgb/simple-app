import jenkins.model.*
import hudson.security.*
import hudson.model.User

def instance = Jenkins.getInstance()

def hudsonRealm = new HudsonPrivateSecurityRealm(false)
instance.setSecurityRealm(hudsonRealm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
instance.setAuthorizationStrategy(strategy)

def user = hudson.model.User.getById('admin', true)
user.addProperty(hudson.security.PasswordProperty.class).setPassword('admin123')
user.save()

println "Admin user created: admin/admin123"
