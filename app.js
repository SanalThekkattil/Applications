// BKD Cricket Team Application
class BKDCricketApp {
    constructor() {
        this.permanentPlayers = [];
        this.guestPlayers = [];
        this.teams = { teamA: [], teamB: [], generated: false };
        this.isAdminMode = false;
        this.editingPlayerId = null;
        this.editingPlayerType = null; // 'permanent' or 'guest'
        
        // Initialize with sample data
        this.initializeSampleData();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing BKD Cricket App...');
        
        // Show main screen
        this.showScreen('main-screen');
        
        // Bind all events
        this.bindEvents();
        
        // Load initial section after a short delay
        setTimeout(() => {
            this.switchSection('players');
        }, 200);
    }

    initializeSampleData() {
        // All players start as UNAVAILABLE by default
        this.permanentPlayers = [
           
            {"id": 1, "name": "Sanal", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 2, "name": "Gokul", "role": "Allrounder", "ranking": 92, "isAvailable": false, "type": "permanent"},
            {"id": 3, "name": "Sudheer", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 4, "name": "Vijesh Kuttan", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 5, "name": "Danush", "role": "Allrounder", "ranking": 89, "isAvailable": false, "type": "permanent"},
            {"id": 6, "name": "Arjun", "role": "Allrounder", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 7, "name": "Pradheesh", "role": "Batter", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 8, "name": "Saurav Appu", "role": "Allrounder", "ranking": 68, "isAvailable": false, "type": "permanent"},
            {"id": 9, "name": "Divekan", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 10, "name": "Hari", "role": "Allrounder", "ranking": 90, "isAvailable": false, "type": "permanent"},
            {"id": 11, "name": "Jayan", "role": "Allrounder", "ranking": 88, "isAvailable": false, "type": "permanent"},
            {"id": 12, "name": "Manikuttan", "role": "Allrounder", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 13, "name": "Muthu", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 14, "name": "Nandu", "role": "Allrounder", "ranking": 65, "isAvailable": false, "type": "permanent"},
            {"id": 15, "name": "Akhil", "role": "Batter", "ranking": 50, "isAvailable": false, "type": "permanent"},
            {"id": 16, "name": "Prajith", "role": "Batter", "ranking": 89, "isAvailable": false, "type": "permanent"},
            {"id": 17, "name": "Pranav", "role": "Batter", "ranking": 60, "isAvailable": false, "type": "permanent"},
            {"id": 19, "name": "Rijith", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 20, "name": "Subhi", "role": "Allrounder", "ranking": 65, "isAvailable": false, "type": "permanent"},
            {"id": 21, "name": "Sumesh", "role": "Allrounder", "ranking": 50, "isAvailable": false, "type": "permanent"},
            {"id": 22, "name": "Unnikuttan", "role": "Bowler", "ranking": 70, "isAvailable": false, "type": "permanent"},
            {"id": 23, "name": "Suresh", "role": "Batter", "ranking": 76, "isAvailable": false, "type": "permanent"},
            {"id": 24, "name": "Jijil Appu", "role": "Allrounder", "ranking": 88, "isAvailable": false, "type": "permanent"},
            {"id": 25, "name": "Santhosh Babu", "role": "Allrounder", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 26, "name": "Kannan Thekkecity", "role": "Allrounder", "ranking": 92, "isAvailable": false, "type": "permanent"},
            {"id": 27, "name": "Unni Thekkecity", "role": "Batter", "ranking": 85, "isAvailable": false, "type": "permanent"},
            {"id": 28, "name": "Vinesh", "role": "Batter", "ranking": 40, "isAvailable": false, "type": "permanent"}
        ];

        this.adminCredentials = {
            username: "admin",
            password: "admin123"
        };
        
        this.guestIdCounter = 1000; // Start guest IDs from 1000 to avoid conflicts
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Navigation buttons - use event delegation on document
        document.addEventListener('click', (e) => {
            // Handle navigation buttons
            if (e.target.classList.contains('nav-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const section = e.target.dataset.section;
                console.log('Navigation clicked:', section);
                if (section) {
                    this.switchSection(section);
                }
                return;
            }

            // Handle admin toggle
            if (e.target.id === 'admin-toggle') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Admin toggle clicked');
                this.toggleAdmin();
                return;
            }

            // Handle other buttons
            if (e.target.id === 'add-guest-btn') {
                e.preventDefault();
                this.openGuestModal();
            } else if (e.target.id === 'add-permanent-player-btn') {
                e.preventDefault();
                this.openPermanentPlayerModal();
            } else if (e.target.id === 'generate-teams-btn') {
                e.preventDefault();
                this.generateTeams();
            } else if (e.target.id === 'regenerate-teams-btn') {
                e.preventDefault();
                this.regenerateTeams();
            }

            // Handle modal close buttons
            if (e.target.id === 'close-admin-login' || e.target.id === 'cancel-admin-login') {
                e.preventDefault();
                this.closeModal('admin-login-modal');
            } else if (e.target.id === 'close-guest-modal' || e.target.id === 'cancel-guest') {
                e.preventDefault();
                this.closeModal('guest-modal');
            } else if (e.target.id === 'close-permanent-modal' || e.target.id === 'cancel-permanent') {
                e.preventDefault();
                this.closeModal('permanent-player-modal');
            }
            
            // Modal overlay clicks
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            }

            // Guest player delete buttons
            if (e.target.classList.contains('delete-guest-btn')) {
                e.preventDefault();
                const guestId = parseInt(e.target.dataset.guestId);
                this.removeGuestPlayer(guestId);
            }

            // Admin panel buttons
            if (e.target.classList.contains('edit-permanent-btn')) {
                e.preventDefault();
                const playerId = parseInt(e.target.dataset.playerId);
                this.editPermanentPlayer(playerId);
            } else if (e.target.classList.contains('delete-permanent-btn')) {
                e.preventDefault();
                const playerId = parseInt(e.target.dataset.playerId);
                this.deletePermanentPlayer(playerId);
            }
        });

        // Handle checkbox changes for player availability
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.playerId) {
                const playerId = parseInt(e.target.dataset.playerId);
                console.log('Toggle changed for player:', playerId);
                this.togglePlayerAvailability(playerId);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (e.target.id === 'admin-login-form') {
                this.handleAdminLogin();
            } else if (e.target.id === 'guest-form') {
                this.saveGuestPlayer();
            } else if (e.target.id === 'permanent-player-form') {
                this.savePermanentPlayer();
            }
        });

        console.log('Events bound successfully');
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            console.log('Showing screen:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }

    switchSection(sectionId) {
        console.log('Switching to section:', sectionId);
        
        // Update navigation - make sure to target the correct buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
            console.log('Navigation button activated:', sectionId);
        } else {
            console.error('Navigation button not found for:', sectionId);
        }

        // Hide all sections first
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            console.log('Section shown:', sectionId);
            
            // Load section data based on which section is active
            switch(sectionId) {
                case 'players':
                    this.renderPlayerSelection();
                    this.updatePlayerStats();
                    break;
                case 'guests':
                    this.renderGuestPlayers();
                    break;
                case 'teams':
                    this.renderTeams();
                    this.updateTeamBalance();
                    break;
                case 'admin':
                    this.renderAdminPanel();
                    break;
                default:
                    console.warn('Unknown section:', sectionId);
            }
        } else {
            console.error('Section not found:', `${sectionId}-section`);
        }
    }

    toggleAdmin() {
        console.log('Toggle admin called, current mode:', this.isAdminMode);
        
        if (this.isAdminMode) {
            // Logout admin
            this.isAdminMode = false;
            document.body.classList.remove('admin-mode');
            const adminToggle = document.getElementById('admin-toggle');
            if (adminToggle) {
                adminToggle.textContent = 'Admin';
                adminToggle.classList.remove('btn--primary');
                adminToggle.classList.add('btn--outline');
            }
            // Switch back to players section
            this.switchSection('players');
        } else {
            // Show admin login
            this.openModal('admin-login-modal');
        }
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('admin-login-error');

        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }

        console.log('Admin login attempt:', username);

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isAdminMode = true;
            document.body.classList.add('admin-mode');
            const adminToggle = document.getElementById('admin-toggle');
            if (adminToggle) {
                adminToggle.textContent = 'Logout';
                adminToggle.classList.remove('btn--outline');
                adminToggle.classList.add('btn--primary');
            }
            this.closeModal('admin-login-modal');
            this.switchSection('admin');
            this.simulateDBSync();
            console.log('Admin login successful');
        } else {
            if (errorDiv) {
                errorDiv.textContent = 'Invalid credentials. Use admin/admin123';
                errorDiv.classList.remove('hidden');
            }
            console.log('Admin login failed');
        }
    }

    // Player Selection Functions
    renderPlayerSelection() {
        console.log('Rendering player selection...');
        const grid = document.getElementById('player-selection-grid');
        if (!grid) {
            console.error('Player selection grid not found');
            return;
        }
        
        grid.innerHTML = '';

        if (this.permanentPlayers.length === 0) {
            grid.innerHTML = '<p class="loading-message">No permanent players found. Admin can add players in the Admin Panel.</p>';
            return;
        }

        this.permanentPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = `player-selection-card ${player.isAvailable ? 'available' : ''}`;
            card.innerHTML = `
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                </div>
                <label class="availability-toggle">
                    <input type="checkbox" ${player.isAvailable ? 'checked' : ''} 
                           data-player-id="${player.id}">
                    <span class="slider"></span>
                </label>
            `;
            grid.appendChild(card);
        });
        
        console.log('Player selection rendered with', this.permanentPlayers.length, 'players');
    }

    togglePlayerAvailability(playerId) {
        console.log('Toggling availability for player ID:', playerId);
        const player = this.permanentPlayers.find(p => p.id === playerId);
        if (player) {
            const wasAvailable = player.isAvailable;
            player.isAvailable = !player.isAvailable;
            console.log(`Player ${player.name} changed from ${wasAvailable} to ${player.isAvailable}`);
            
            // Update UI immediately
            this.updatePlayerStats();
            this.resetTeams();
            this.simulateDBSync();
            
            // Update the card appearance
            const checkbox = document.querySelector(`input[data-player-id="${playerId}"]`);
            if (checkbox) {
                const card = checkbox.closest('.player-selection-card');
                if (card) {
                    if (player.isAvailable) {
                        card.classList.add('available');
                    } else {
                        card.classList.remove('available');
                    }
                }
            }
        } else {
            console.error('Player not found for ID:', playerId);
        }
    }

    updatePlayerStats() {
        const total = this.permanentPlayers.length;
        const available = this.permanentPlayers.filter(p => p.isAvailable).length;

        console.log(`Updating stats: ${available}/${total} players available`);

        const totalElement = document.getElementById('total-count');
        const availableElement = document.getElementById('available-count');

        if (totalElement) {
            totalElement.textContent = total;
            console.log('Updated total count element');
        } else {
            console.error('Total count element not found');
        }

        if (availableElement) {
            availableElement.textContent = available;
            console.log('Updated available count element');
        } else {
            console.error('Available count element not found');
        }
    }

    // Guest Player Functions
    renderGuestPlayers() {
        console.log('Rendering guest players...');
        const container = document.getElementById('guest-players-list');
        if (!container) {
            console.error('Guest players list not found');
            return;
        }
        
        container.innerHTML = '';

        if (this.guestPlayers.length === 0) {
            container.innerHTML = '<p class="no-guests">No guest players added yet. Click "Add Guest Player" to add temporary players for today\'s match.</p>';
            return;
        }

        this.guestPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = 'guest-player-card';
            card.innerHTML = `
                <div class="guest-player-info">
                    <span class="guest-badge">GUEST</span>
                    <div class="player-name">${player.name}</div>
                    <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                </div>
                <button class="btn btn--sm btn--outline delete-guest-btn" data-guest-id="${player.id}" 
                        style="color: var(--color-error); border-color: var(--color-error);">Remove</button>
            `;
            container.appendChild(card);
        });

        console.log('Guest players rendered:', this.guestPlayers.length);
    }

    openGuestModal() {
        this.editingPlayerId = null;
        this.editingPlayerType = 'guest';
        const form = document.getElementById('guest-form');
        if (form) {
            form.reset();
        }
        this.openModal('guest-modal');
    }

    saveGuestPlayer() {
        const name = document.getElementById('guest-name').value.trim();
        const role = document.getElementById('guest-role').value;

        if (!name || !role) {
            alert('Please fill in all fields.');
            return;
        }

        // Check for duplicate names
        const existingGuest = this.guestPlayers.find(p => p.name.toLowerCase() === name.toLowerCase());
        const existingPermanent = this.permanentPlayers.find(p => p.name.toLowerCase() === name.toLowerCase());
        
        if (existingGuest || existingPermanent) {
            alert('A player with this name already exists. Please use a different name.');
            return;
        }

        const newGuest = {
            id: this.guestIdCounter++,
            name,
            role,
            ranking: 75, // Default neutral ranking for team balancing
            isAvailable: true, // Guest players are always available
            type: 'guest'
        };

        this.guestPlayers.push(newGuest);
        console.log('Added guest player:', newGuest);
        
        this.closeModal('guest-modal');
        this.renderGuestPlayers();
        this.resetTeams();
    }

    removeGuestPlayer(guestId) {
        const guest = this.guestPlayers.find(p => p.id === guestId);
        if (guest && confirm(`Remove ${guest.name} from guest players?`)) {
            this.guestPlayers = this.guestPlayers.filter(p => p.id !== guestId);
            this.renderGuestPlayers();
            this.resetTeams();
        }
    }

    // Team Generation Functions
    generateTeams() {
        const availablePermanent = this.permanentPlayers.filter(p => p.isAvailable);
        const availableGuests = this.guestPlayers.slice(); // All guests are available
        const allAvailable = [...availablePermanent, ...availableGuests];
        
        console.log('Generating teams with players:', allAvailable.length);
        
        if (allAvailable.length < 4) {
            alert('Need at least 4 players to generate teams. Please select more players or add guest players.');
            return;
        }

        if (allAvailable.length < 6) {
            if (!confirm(`Only ${allAvailable.length} players are available. Teams will be uneven. Continue?`)) {
                return;
            }
        }

        this.showLoadingOverlay();

        // Simulate processing time
        setTimeout(() => {
            this.teams = this.createBalancedTeams(allAvailable);
            this.renderTeams();
            this.updateTeamBalance();
            this.hideLoadingOverlay();
            
            // Show regenerate button
            const regenerateBtn = document.getElementById('regenerate-teams-btn');
            if (regenerateBtn) {
                regenerateBtn.classList.remove('hidden');
            }
        }, 1500);
    }

    regenerateTeams() {
        const availablePermanent = this.permanentPlayers.filter(p => p.isAvailable);
        const availableGuests = this.guestPlayers.slice();
        const allAvailable = [...availablePermanent, ...availableGuests];
        
        if (allAvailable.length < 4) {
            alert('Need at least 4 players to generate teams.');
            return;
        }

        this.showLoadingOverlay();

        // Add some randomization for different team combinations
        setTimeout(() => {
            this.teams = this.createBalancedTeams(allAvailable, true);
            this.renderTeams();
            this.updateTeamBalance();
            this.hideLoadingOverlay();
        }, 1000);
    }

    createBalancedTeams(players, randomize = false) {
        // Create a copy and optionally add some randomization
        let playersCopy = [...players];
        
        if (randomize) {
            // Add small random factors to create different team combinations
            playersCopy = playersCopy.map(p => ({
                ...p,
                tempRanking: p.ranking + (Math.random() * 10 - 5) // ±5 random adjustment
            }));
        }

        // Sort by ranking (using tempRanking if randomized)
        const sortedPlayers = playersCopy.sort((a, b) => 
            (b.tempRanking || b.ranking) - (a.tempRanking || a.ranking)
        );
        
        let teamA = [];
        let teamB = [];
        
        // Snake draft algorithm for balanced teams
        sortedPlayers.forEach((player, index) => {
            const teamAStrength = teamA.reduce((sum, p) => sum + (p.tempRanking || p.ranking), 0);
            const teamBStrength = teamB.reduce((sum, p) => sum + (p.tempRanking || p.ranking), 0);
            
            // Add to smaller team first, then consider strength
            if (teamA.length < teamB.length) {
                teamA.push(player);
            } else if (teamB.length < teamA.length) {
                teamB.push(player);
            } else {
                // Equal size, add to weaker team
                if (teamAStrength <= teamBStrength) {
                    teamA.push(player);
                } else {
                    teamB.push(player);
                }
            }
        });

        // Remove temporary ranking
        teamA = teamA.map(p => {
            const { tempRanking, ...player } = p;
            return player;
        });
        teamB = teamB.map(p => {
            const { tempRanking, ...player } = p;
            return player;
        });

        return {
            teamA,
            teamB,
            generated: true
        };
    }

    renderTeams() {
        this.renderTeamCard('team-a', this.teams.teamA);
        this.renderTeamCard('team-b', this.teams.teamB);
    }

    renderTeamCard(teamId, players) {
        const playersContainer = document.getElementById(`${teamId}-players`);
        const countBadge = document.getElementById(`${teamId}-count-badge`);

        if (!playersContainer) return;

        if (players.length === 0) {
            playersContainer.innerHTML = '<p class="no-teams">Select available players and click "Generate Teams" to create balanced teams</p>';
            if (countBadge) countBadge.textContent = '(0 players)';
            return;
        }

        if (countBadge) countBadge.textContent = `(${players.length} players)`;

        playersContainer.innerHTML = '';
        players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = `team-player ${player.type === 'guest' ? 'guest-player' : ''}`;
            
            const badgeHtml = player.type === 'guest' ? 
                '<span class="guest-badge">GUEST</span>' : '';
            
            playerDiv.innerHTML = `
                <div class="player-details">
                    ${badgeHtml}
                    <span class="player-name">${player.name}</span>
                    <span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span>
                </div>
            `;
            playersContainer.appendChild(playerDiv);
        });
    }

    updateTeamBalance() {
        const balanceInfo = document.getElementById('team-balance-info');
        if (!balanceInfo) return;
        
        if (!this.teams.generated || this.teams.teamA.length === 0 || this.teams.teamB.length === 0) {
            balanceInfo.classList.add('hidden');
            return;
        }

        const teamAStrength = this.teams.teamA.reduce((sum, p) => sum + p.ranking, 0);
        const teamBStrength = this.teams.teamB.reduce((sum, p) => sum + p.ranking, 0);
        const strengthDiff = Math.abs(teamAStrength - teamBStrength);
        
        let balanceQuality = 'Perfect';
        if (strengthDiff > 50) balanceQuality = 'Poor';
        else if (strengthDiff > 25) balanceQuality = 'Fair';
        else if (strengthDiff > 10) balanceQuality = 'Good';

        const strengthDiffElement = document.getElementById('strength-diff');
        const balanceQualityElement = document.getElementById('balance-quality');
        
        if (strengthDiffElement) strengthDiffElement.textContent = strengthDiff;
        if (balanceQualityElement) balanceQualityElement.textContent = balanceQuality;
        
        balanceInfo.classList.remove('hidden');
    }

    resetTeams() {
        this.teams = { teamA: [], teamB: [], generated: false };
        if (document.getElementById('teams-section') && !document.getElementById('teams-section').classList.contains('hidden')) {
            this.renderTeams();
        }
        const regenerateBtn = document.getElementById('regenerate-teams-btn');
        if (regenerateBtn) {
            regenerateBtn.classList.add('hidden');
        }
        const balanceInfo = document.getElementById('team-balance-info');
        if (balanceInfo) {
            balanceInfo.classList.add('hidden');
        }
    }

    // Admin Panel Functions
    renderAdminPanel() {
        console.log('Rendering admin panel...');
        const tbody = document.getElementById('admin-players-tbody');
        if (!tbody) {
            console.error('Admin players table body not found');
            return;
        }
        
        tbody.innerHTML = '';

        if (this.permanentPlayers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" style="text-align: center; color: var(--color-text-secondary); padding: var(--space-24);">No permanent players. Click "Add Permanent Player" to get started.</td>';
            tbody.appendChild(row);
            return;
        }

        this.permanentPlayers.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${player.name}</strong></td>
                <td><span class="role-badge role-badge--${player.role.toLowerCase()}">${player.role}</span></td>
                <td><span class="ranking-badge ${this.getRankingClass(player.ranking)}">${player.ranking}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--sm btn--outline edit-permanent-btn" data-player-id="${player.id}">Edit</button>
                        <button class="btn btn--sm btn--outline delete-permanent-btn" data-player-id="${player.id}" style="color: var(--color-error); border-color: var(--color-error);">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        console.log('Admin panel rendered');
    }

    getRankingClass(ranking) {
        if (ranking >= 80) return 'ranking-badge--high';
        if (ranking >= 70) return 'ranking-badge--medium';
        return 'ranking-badge--low';
    }

    openPermanentPlayerModal(playerId = null) {
        this.editingPlayerId = playerId;
        this.editingPlayerType = 'permanent';
        const title = document.getElementById('permanent-modal-title');
        const form = document.getElementById('permanent-player-form');

        if (playerId) {
            const player = this.permanentPlayers.find(p => p.id === playerId);
            if (player) {
                if (title) title.textContent = 'Edit Permanent Player';
                document.getElementById('permanent-name').value = player.name;
                document.getElementById('permanent-role').value = player.role;
                document.getElementById('permanent-ranking').value = player.ranking;
            }
        } else {
            if (title) title.textContent = 'Add Permanent Player';
            if (form) form.reset();
        }

        this.openModal('permanent-player-modal');
    }

    savePermanentPlayer() {
        const name = document.getElementById('permanent-name').value.trim();
        const role = document.getElementById('permanent-role').value;
        const ranking = parseInt(document.getElementById('permanent-ranking').value);

        if (!name || !role || !ranking || ranking < 1 || ranking > 100) {
            alert('Please fill in all fields correctly. Ranking must be between 1-100.');
            return;
        }

        // Check for duplicates (excluding current player if editing)
        const existing = this.permanentPlayers.find(p => 
            p.name.toLowerCase() === name.toLowerCase() && p.id !== this.editingPlayerId
        );
        
        if (existing) {
            alert('A player with this name already exists.');
            return;
        }

        if (this.editingPlayerId) {
            // Edit existing
            const playerIndex = this.permanentPlayers.findIndex(p => p.id === this.editingPlayerId);
            if (playerIndex !== -1) {
                this.permanentPlayers[playerIndex] = {
                    ...this.permanentPlayers[playerIndex],
                    name,
                    role,
                    ranking
                };
            }
        } else {
            // Add new
            const newId = Math.max(...this.permanentPlayers.map(p => p.id), 0) + 1;
            this.permanentPlayers.push({
                id: newId,
                name,
                role,
                ranking,
                isAvailable: false, // Default to unavailable
                type: 'permanent'
            });
        }

        this.closeModal('permanent-player-modal');
        this.renderAdminPanel();
        this.renderPlayerSelection();
        this.updatePlayerStats();
        this.resetTeams();
        this.simulateDBSync();
    }

    editPermanentPlayer(playerId) {
        this.openPermanentPlayerModal(playerId);
    }

    deletePermanentPlayer(playerId) {
        const player = this.permanentPlayers.find(p => p.id === playerId);
        if (player && confirm(`Delete ${player.name} permanently? This cannot be undone.`)) {
            this.permanentPlayers = this.permanentPlayers.filter(p => p.id !== playerId);
            this.renderAdminPanel();
            this.renderPlayerSelection();
            this.updatePlayerStats();
            this.resetTeams();
            this.simulateDBSync();
        }
    }

    // Modal Functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Focus first input
            const firstInput = modal.querySelector('input[type="text"], input[type="password"]');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        this.editingPlayerId = null;
        this.editingPlayerType = null;
    }

    // Loading Functions
    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // Database Simulation (Only for permanent players)
    simulateDBSync() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (!statusIndicator || !statusText) return;
        
        // Show syncing state
        statusIndicator.style.background = 'var(--color-warning)';
        statusIndicator.style.animation = 'pulse 0.5s infinite';
        statusText.textContent = 'Syncing Database...';
        
        // Simulate sync completion
        setTimeout(() => {
            statusIndicator.style.background = 'var(--color-success)';
            statusIndicator.style.animation = 'pulse 2s infinite';
            statusText.textContent = 'Database Connected';
        }, 1000);
    }
}

// Initialize the BKD Cricket Team application
const app = new BKDCricketApp();
