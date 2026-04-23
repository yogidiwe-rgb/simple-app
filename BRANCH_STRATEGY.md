# Git Branch Strategy

## 🌿 Branch Structure

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features

### Supporting Branches
- **feature/***: Individual feature development
- **hotfix/***: Emergency fixes to production

## 🔄 Pipeline Triggers

### 1. Feature Pipeline
- **Trigger**: Push to `feature/*` branch
- **Actions**: Build + basic validation
- **Deployment**: None

### 2. Dev Pipeline  
- **Trigger**: Merge to `develop` branch
- **Actions**: Build Docker images + deploy to DEV cluster
- **Testing**: Basic integration tests

### 3. Prod Pipeline
- **Trigger**: Pull Request `develop` → `main`
- **Actions**: Manual approval + deploy to PROD cluster
- **Testing**: Full integration tests

## 📋 Workflow Example

```bash
# 1. Create feature branch
git checkout -b feature/user-authentication

# 2. Develop and commit
git add .
git commit -m "feat: add user authentication"

# 3. Push feature branch (triggers Feature pipeline)
git push origin feature/user-authentication

# 4. Create PR to develop
# 5. After review, merge to develop (triggers Dev pipeline)

# 6. Test in DEV environment
# 7. Create PR develop → main (triggers Prod pipeline)
# 8. Manual approval
# 9. Deploy to PROD
```

## 🎯 Branch Naming Conventions

- **Features**: `feature/description-of-feature`
- **Fixes**: `fix/description-of-fix`  
- **Hotfixes**: `hotfix/description-of-hotfix`
- **Releases**: `release/version-number`

## 📝 Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions
- `chore`: Maintenance tasks

**Examples:**
- `feat(api): add user authentication endpoint`
- `fix(frontend): resolve login button issue`
- `docs(readme): update deployment instructions`
