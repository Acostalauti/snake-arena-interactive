# Deploying Snake Arena to Render

Complete guide for deploying the unified Snake Arena application to Render cloud platform.

## Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Git Repository** - Push your code to GitHub if not already done

## Deployment Options

### Option 1: Blueprint Deployment (Recommended) ⭐

The easiest method - uses the `render.yaml` file to automatically set up everything.

#### Steps:

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create New Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New"** → **"Blueprint"**
   - Connect your GitHub repository
   - Select the repository: `snake-arena-interactive`
   - Render will automatically detect `render.yaml`

3. **Configure Blueprint**
   - Review the services that will be created:
     - PostgreSQL database (`snake_arena_db`)
     - Web service (`snake-arena-app`)
   - Click **"Apply"**

4. **Wait for Deployment**
   - Database creation: ~2-3 minutes
   - Application build: ~3-5 minutes
   - Total: ~5-8 minutes

5. **Access Your Application**
   - Your app will be available at: `https://snake-arena-app.onrender.com`
   - API docs: `https://snake-arena-app.onrender.com/docs`

---

### Option 2: Manual Deployment

If you prefer manual setup or need more control:

#### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `snake-arena-db`
   - **Database**: `snake_arena`
   - **User**: `snake_arena_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click **"Create Database"**
5. **Save the Internal Database URL** (you'll need this for the web service)

#### Step 2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `snake-arena-app`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Plan**: Free
4. **Environment Variables**:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 1
   - `SECRET_KEY`: Generate a random string (e.g., run `openssl rand -hex 32`)
   - `PORT`: `8000`
5. **Advanced Settings**:
   - **Health Check Path**: `/api`
   - **Auto-Deploy**: Yes
6. Click **"Create Web Service"**

---

## Environment Variables

The application needs these environment variables:

| Variable | Source | Description |
|----------|--------|-------------|
| `DATABASE_URL` | Auto (from database) | PostgreSQL connection string |
| `SECRET_KEY` | Manual | Random secret for sessions |
| `PORT` | `8000` | Application port (Render default) |

### Generating SECRET_KEY

```bash
# On Linux/Mac
openssl rand -hex 32

# Or use Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## Render Free Tier Details

**What's Included:**
- ✅ PostgreSQL database (90 days, then $7/month)
- ✅ 750 hours/month of web service runtime
- ✅ Automatic SSL/HTTPS
- ✅ Auto-deploy from GitHub
- ✅ Custom domain support

**Limitations:**
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ Cold start time: 30-60 seconds
- ⚠️ 512 MB RAM
- ⚠️ Shared CPU

**Upgrade to Paid ($7/month):**
- No spin down
- Faster instances
- More RAM/CPU

---

## Post-Deployment

### Verify Deployment

1. **Check Service Status**
   - Go to Render Dashboard
   - Both services should show "Live" status

2. **Test Frontend**
   ```bash
   curl https://your-app-name.onrender.com/
   ```

3. **Test API**
   ```bash
   curl https://your-app-name.onrender.com/api
   curl https://your-app-name.onrender.com/leaderboard
   ```

4. **Visit in Browser**
   - Open: `https://your-app-name.onrender.com`
   - Should see Snake Arena game interface

### View Logs

- Go to your service in Render Dashboard
- Click **"Logs"** tab
- Watch for startup messages and errors

---

## Troubleshooting

### Build Fails

**Error: "Failed to build Docker image"**

Solution:
- Check Logs for specific error
- Ensure all files are committed to Git
- Verify `Dockerfile` syntax
- Check that `frontend` and `backend` directories exist

### Database Connection Error

**Error: "Could not connect to database"**

Solutions:
1. Verify `DATABASE_URL` env variable is set correctly
2. Ensure database service is "Live"
3. Check that web service and database are in same region
4. Use **Internal Database URL**, not External

### Service Won't Start

**Error: "Service unhealthy"**

Solutions:
1. Check health check path is `/api` (not `/`)
2. Ensure port 8000 is exposed
3. Review logs for Python/Node errors
4. Verify all dependencies are in `pyproject.toml` and `package.json`

### Cold Start Issues

**Symptom: First request takes 30-60 seconds**

This is expected on free tier. Solutions:
- Upgrade to paid plan ($7/month) for always-on service
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your app every 5 minutes
- Accept the cold start as part of free tier

---

## Updating Your App

### Automatic Updates

With auto-deploy enabled:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render automatically rebuilds and deploys in ~3-5 minutes.

### Manual Deploy

1. Go to Render Dashboard
2. Select your web service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Custom Domain

### Add Custom Domain

1. Go to your web service settings
2. Click **"Custom Domains"**
3. Add your domain (e.g., `snakearena.com`)
4. Update DNS records as instructed:
   - **CNAME**: `your-app-name.onrender.com`
5. SSL certificate auto-provisions in ~15 minutes

---

## Monitoring & Scaling

### Free Tier Monitoring

- **Metrics**: Available in Dashboard (CPU, Memory, Response time)
- **Logs**: Rolling 7-day retention
- **Alerts**: Email on deploy failures

### Scaling Options

| Plan | Price | RAM | CPU | Features |
|------|-------|-----|-----|----------|
| Free | $0 | 512 MB | Shared | Spins down |
| Starter | $7/mo | 512 MB | Shared | Always on |
| Standard | $25/mo | 2 GB | 1 CPU | Better performance |
| Pro | $85/mo | 4 GB | 2 CPU | High traffic |

---

## Cost Estimate

**Free Tier:**
- Web Service: Free (750 hrs/month)
- PostgreSQL: Free for 90 days, then $7/month
- **Total: $0/month** (first 90 days), **$7/month** after

**Production Setup:**
- Web Service: $7/month (always-on)
- PostgreSQL: $7/month
- **Total: $14/month**

---

## Next Steps

1. ✅ Deploy to Render
2. Test the application thoroughly
3. Set up custom domain (optional)
4. Configure monitoring/alerts
5. Share your live app! 🎉

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Discord Community](https://render.com/discord)
- [Render Status](https://status.render.com/)

---

## Quick Reference

**Your URLs:**
- Application: `https://snake-arena-app.onrender.com`
- API Docs: `https://snake-arena-app.onrender.com/docs`
- Dashboard: `https://dashboard.render.com`

**Important Commands:**
```bash
# Deploy updates
git push origin main

# View live logs
# (Use Render Dashboard > Service > Logs tab)

# Generate secret key
openssl rand -hex 32
```
