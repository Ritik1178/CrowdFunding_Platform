import { auth, db } from './firebase.js';
import { 
    collection, 
    query, 
    where, 
    getDocs,
    doc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

class Dashboard {
    constructor() {
        this.campaigns = [];
        this.stats = {
            totalRaised: 0,
            totalCampaigns: 0,
            activeBackers: 0
        };
        
        // Ensure user is authenticated
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = '/pages/login.html';
                return;
            }
            this.userId = user.uid;
            this.loadDashboard();
        });
    }

    async loadDashboard() {
        try {
            await Promise.all([
                this.loadUserCampaigns(),
                this.loadUserStats()
            ]);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data. Please try again.');
        }
    }

    async loadUserCampaigns() {
        try {
            const campaignsRef = collection(db, 'campaigns');
            const q = query(campaignsRef, where('creatorId', '==', this.userId));
            const querySnapshot = await getDocs(q);
            
            this.campaigns = [];
            querySnapshot.forEach((doc) => {
                this.campaigns.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderCampaigns();
        } catch (error) {
            console.error('Error loading campaigns:', error);
            this.showError('Failed to load campaigns. Please try again.');
        }
    }

    async loadUserStats() {
        try {
            const userStatsRef = doc(db, 'userStats', this.userId);
            const statsDoc = await getDoc(userStatsRef);
            
            if (statsDoc.exists()) {
                this.stats = statsDoc.data();
            }
            
            this.renderStats();
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showError('Failed to load statistics. Please try again.');
        }
    }

    renderStats() {
        const statsContainer = document.querySelector('.stats-grid');
        if (!statsContainer) return;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Raised</h3>
                <div class="value">${formatter.format(this.stats.totalRaised || 0)}</div>
                <div class="trend up">
                    <span>↑</span> 12% from last month
                </div>
            </div>
            <div class="stat-card">
                <h3>Active Campaigns</h3>
                <div class="value">${this.stats.totalCampaigns || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Total Backers</h3>
                <div class="value">${this.stats.activeBackers || 0}</div>
                <div class="trend up">
                    <span>↑</span> 8% from last month
                </div>
            </div>
        `;
    }

    renderCampaigns() {
        const campaignsContainer = document.getElementById('campaignsList');
        if (!campaignsContainer) return;

        if (this.campaigns.length === 0) {
            campaignsContainer.innerHTML = `
                <div class="no-campaigns">
                    <h3>No Campaigns Yet</h3>
                    <p>Start your first campaign and begin your crowdfunding journey!</p>
                    <a href="/pages/create-campaign.html" class="btn btn-primary">Create Campaign</a>
                </div>
            `;
            return;
        }

        campaignsContainer.innerHTML = this.campaigns.map(campaign => {
            const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
            
            return `
                <div class="campaign-card">
                    <img src="${campaign.imageUrl || '/assets/media/placeholder.jpg'}" 
                         alt="${campaign.title}" 
                         class="campaign-image">
                    <div class="campaign-content">
                        <h3 class="campaign-title">${campaign.title}</h3>
                        <p class="campaign-description">${campaign.description}</p>
                        
                        <div class="campaign-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="campaign-stats">
                                <div class="stat-item">
                                    <div class="value">$${campaign.currentAmount}</div>
                                    <div class="label">Raised</div>
                                </div>
                                <div class="stat-item">
                                    <div class="value">${progress.toFixed(1)}%</div>
                                    <div class="label">Progress</div>
                                </div>
                                <div class="stat-item">
                                    <div class="value">${campaign.backers || 0}</div>
                                    <div class="label">Backers</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <a href="/pages/campaign.html?id=${campaign.id}" 
                               class="btn btn-primary">View Details</a>
                            <button class="btn btn-secondary" 
                                    onclick="shareCampaign('${campaign.id}')">Share</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showError(message) {
        const errorContainer = document.getElementById('dashboardError');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.add('show');
        }
    }
}

// Initialize dashboard
const dashboard = new Dashboard();
