// Initial student data for MCA Section B
const initialStudents = [
    { name: "Amrita Swain", rollNo: "202469099", section: "B" },
    { name: "A Deepika", rollNo: "202469105", section: "B" },
    { name: "Kedara Mishra", rollNo: "202468096", section: "B" },
    { name: "Rabindra Kumar Sahu", rollNo: "202468090", section: "B" },
    { name: "Kumari Likhita Pradhan", rollNo: "202469097", section: "B" },
    { name: "Aditya Choudhury", rollNo: "202468093", section: "B" },
    { name: "G.Aditya Prasad Achary", rollNo: "202468088", section: "B" },
    { name: "Debasish Mishra", rollNo: "202468061", section: "B" },
    { name: "Puja Jena", rollNo: "202469076", section: "B" },
    { name: "D.Lipsa", rollNo: "202465106", section: "B" },
    { name: "Prayash kumar Panda", rollNo: "202468104", section: "B" },
    { name: "Manaswini Patnaik", rollNo: "202469068", section: "B" },
    { name: "Sagar Panigrahi", rollNo: "202468071", section: "B" },
    { name: "Badal Kumar Jena", rollNo: "202468107", section: "B" },
    { name: "Smruti Ranjan Pradhan", rollNo: "202460111", section: "B" },
    { name: "J. Subhasri Achary", rollNo: "202469077", section: "B" },
    { name: "Monalisa Jena", rollNo: "202469079", section: "B" },
    { name: "Sangram Swain", rollNo: "202468066", section: "B" },
    { name: "B Sonali Priyadarsani", rollNo: "202469087", section: "B" },
    { name: "Satish Kumar Mahapatra", rollNo: "202468083", section: "B" },
    { name: "Lipsha Rani Padhi", rollNo: "202469110", section: "B" },
    { name: "Ayushi satapathy", rollNo: "202469073", section: "B" },
    { name: "Surabhi Priyadarshini Moharana", rollNo: "202467091", section: "B" },
    { name: "Kalyani Behera", rollNo: "202469098", section: "B" },
    { name: "Rajesh Kumar Dalai", rollNo: "202468078", section: "B" },
    { name: "Aditya Behera", rollNo: "202468089", section: "B" },
    { name: "Nisant Kumar Pardhan", rollNo: "202468080", section: "B" },
    { name: "A. Priyanka Achary", rollNo: "202469082", section: "B" },
    { name: "Chirag Bishoyi", rollNo: "202468109", section: "B" },
    { name: "A. Sagar", rollNo: "202468070", section: "B" },
    { name: "U. Sohan Kumar", rollNo: "202468062", section: "B" },
    { name: "Abhilipsa Pradhan", rollNo: "202369065", section: "B" },
    { name: "Dandapani Panda", rollNo: "202468072", section: "B" },
    { name: "Debasis panda", rollNo: "202468069", section: "B" },
    { name: "Tara Prasad Patnaik", rollNo: "202468086", section: "B" },
    { name: "Rasmiranjan padhi", rollNo: "202468101", section: "B" },
    { name: "Shalini mishra", rollNo: "202469085", section: "B" },
    { name: "G. Mahesh", rollNo: "202468075", section: "B" },
    { name: "B Sonali Achary", rollNo: "202469100", section: "B" },
    { name: "Amit kumar bhusal", rollNo: "202468067", section: "B" },
    { name: "N. Priyanka Rani", rollNo: "202469094", section: "B" },
    { name: "Rudra narayan pradhan", rollNo: "202468116", section: "B" },
    { name: "Snehali Bishoyi", rollNo: "202469081", section: "B" },
    { name: "B.smita reddy", rollNo: "202469084", section: "B" }
];

// Application state
let students = [];
let availableStudents = [];
let selectedForTeam = [];
let teams = [];
let db = null;
let isAdmin = false;
let dataLoaded = false;

// Admin credentials (in production, use Firebase Authentication)
const ADMIN_ACCOUNTS = [
    { username: "Mahesh", password: "Mahesh@mca@2002" },
    { username: "admin", password: "dwdm@nist" }
];

// Show loading skeleton in student list
function showLoading() {
    const skeleton = document.getElementById('studentLoadingSkeleton');
    const studentList = document.getElementById('studentList');
    if (skeleton) {
        skeleton.classList.remove('hidden');
    }
    // Clear student list while loading
    if (studentList) {
        const students = studentList.querySelectorAll('.student-item');
        students.forEach(s => s.remove());
    }
}

// Hide loading skeleton
function hideLoading() {
    const skeleton = document.getElementById('studentLoadingSkeleton');
    if (skeleton) {
        skeleton.classList.add('hidden');
    }
}

// Initialize the application
function init() {
    // Check if admin session exists
    checkAdminSession();
    
    // Wait for Firebase to be ready
    if (typeof firebase !== 'undefined' && window.db) {
        db = window.db;
        // Don't show loading yet - will show after splash
        initializeFirebase();
    } else {
        // Fallback to localStorage if Firebase is not available
        console.warn('Firebase not available, using localStorage');
        students = [...initialStudents];
        loadFromLocalStorage();
        renderStudentList();
        renderTeams();
        updateStatistics();
    }
    attachEventListeners();
}

// Check if admin is logged in
function checkAdminSession() {
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
        isAdmin = true;
        updateAdminUI();
    }
}

// Update UI based on admin status
function updateAdminUI() {
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminStatus = document.getElementById('adminStatus');
    
    if (isAdmin) {
        adminLoginBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i>[LOGOUT]';
        adminLoginBtn.classList.remove('bg-gray-700', 'border-gray-700');
        adminLoginBtn.classList.add('bg-gray-600', 'border-gray-600');
        adminStatus.classList.remove('hidden');
    } else {
        adminLoginBtn.innerHTML = '<i class="fas fa-lock mr-2"></i>[ADMIN_LOGIN]';
        adminLoginBtn.classList.remove('bg-gray-600', 'border-gray-600');
        adminLoginBtn.classList.add('bg-gray-700', 'border-gray-700');
        adminStatus.classList.add('hidden');
    }
}

// Admin login
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    // Check if credentials match any admin account
    const isValidAdmin = ADMIN_ACCOUNTS.some(admin => 
        admin.username === username && admin.password === password
    );
    
    if (isValidAdmin) {
        isAdmin = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        updateAdminUI();
        closeAdminModal();
        showNotification('Admin login successful!', 'success');
    } else {
        errorDiv.textContent = 'Invalid username or password!';
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 3000);
    }
}

// Admin logout
function adminLogout() {
    isAdmin = false;
    sessionStorage.removeItem('adminLoggedIn');
    updateAdminUI();
    showNotification('Admin logged out', 'info');
}

// Open admin modal
function openAdminModal() {
    if (isAdmin) {
        // If already logged in, logout
        adminLogout();
    } else {
        // Show login modal
        document.getElementById('adminModal').classList.remove('hidden');
        document.getElementById('adminModal').classList.add('flex');
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminUsername').focus();
    }
}

// Close admin modal
function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
    document.getElementById('adminModal').classList.remove('flex');
    document.getElementById('loginError').classList.add('hidden');
}

// Initialize Firebase listeners
function initializeFirebase() {
    updateSyncStatus('Connecting...', 'text-yellow-500');
    
    // Load students from Firebase
    db.ref('students').once('value', (snapshot) => {
        const firebaseStudents = snapshot.val();
        if (firebaseStudents) {
            students = Object.values(firebaseStudents);
            
            // Check if students need section field update
            const needsUpdate = students.some(s => !s.section);
            if (needsUpdate) {
                console.log('Updating students with section information...');
                updateStudentsWithSections();
                return; // Exit here, updateStudentsWithSections will handle the rest
            }
        } else {
            // Initialize with default students
            students = [...initialStudents];
            students.forEach(student => {
                db.ref('students').push(student);
            });
        }
        
        // Load teams from Firebase
        loadTeamsFromFirebase();
    });
}

// Load teams from Firebase
function loadTeamsFromFirebase() {
    db.ref('teams').on('value', (snapshot) => {
        const firebaseTeams = snapshot.val();
        teams = firebaseTeams ? Object.entries(firebaseTeams).map(([key, value]) => ({
            ...value,
            firebaseKey: key
        })) : [];
        
        const assignedRollNos = teams.flatMap(team => team.members.map(m => m.rollNo));
        availableStudents = students.filter(s => !assignedRollNos.includes(s.rollNo));
        
        renderStudentList();
        renderTeams();
        updateStatistics();
        updateSyncStatus('Connected', 'text-green-500');
        
        // Mark data as loaded and hide skeleton
        dataLoaded = true;
        hideLoading();
    });
}

// Update sync status
function updateSyncStatus(text, colorClass) {
    const syncText = document.getElementById('syncText');
    const syncIcon = document.querySelector('#syncStatus i');
    if (syncText) syncText.textContent = text;
    if (syncIcon) {
        syncIcon.className = `fas fa-circle ${colorClass}`;
    }
}

// Update Firebase students with section field
function updateStudentsWithSections() {
    if (!db) return;
    
    // Clear existing students in Firebase
    db.ref('students').remove().then(() => {
        // Add all students with section field
        initialStudents.forEach(student => {
            db.ref('students').push(student);
        });
        
        // Reload students
        db.ref('students').once('value', (snapshot) => {
            const firebaseStudents = snapshot.val();
            if (firebaseStudents) {
                students = Object.values(firebaseStudents);
                
                // Now load teams
                loadTeamsFromFirebase();
                
                showNotification('Student data updated with sections!', 'success');
            }
        });
    });
}

// Load data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('mcaTeams');
    if (savedData) {
        const data = JSON.parse(savedData);
        teams = data.teams || [];
        const assignedRollNos = teams.flatMap(team => team.members.map(m => m.rollNo));
        availableStudents = students.filter(s => !assignedRollNos.includes(s.rollNo));
    }
}

// Save data to localStorage (fallback)
function saveToLocalStorage() {
    localStorage.setItem('mcaTeams', JSON.stringify({ teams }));
}

// Save team to Firebase
function saveTeamToFirebase(team) {
    if (db) {
        db.ref('teams').push(team);
    } else {
        saveToLocalStorage();
    }
}

// Delete team from Firebase
function deleteTeamFromFirebase(firebaseKey) {
    if (db && firebaseKey) {
        db.ref('teams/' + firebaseKey).remove();
    } else {
        saveToLocalStorage();
    }
}

// Add new student
function addNewStudent() {
    const nameInput = document.getElementById('newStudentName');
    const rollInput = document.getElementById('newStudentRoll');
    const sectionInput = document.getElementById('newStudentSection');
    
    const name = nameInput.value.trim();
    const rollNo = rollInput.value.trim();
    const section = sectionInput.value;
    
    if (!name || !rollNo || !section) {
        showNotification('Please enter name, roll number, and section!', 'warning');
        return;
    }
    
    // Check if roll number already exists
    if (students.some(s => s.rollNo === rollNo)) {
        showNotification('Roll number already exists!', 'warning');
        return;
    }
    
    const newStudent = { name, rollNo, section };
    
    if (db) {
        // Save to Firebase
        db.ref('students').push(newStudent).then(() => {
            students.push(newStudent);
            availableStudents.push(newStudent);
            availableStudents.sort((a, b) => a.name.localeCompare(b.name));
            
            nameInput.value = '';
            rollInput.value = '';
            sectionInput.value = '';
            document.getElementById('addStudentForm').classList.add('hidden');
            
            renderStudentList();
            updateStatistics();
            showNotification('Student added successfully!', 'success');
        });
    } else {
        // Fallback to local storage
        students.push(newStudent);
        availableStudents.push(newStudent);
        availableStudents.sort((a, b) => a.name.localeCompare(b.name));
        
        nameInput.value = '';
        rollInput.value = '';
        sectionInput.value = '';
        document.getElementById('addStudentForm').classList.add('hidden');
        
        renderStudentList();
        updateStatistics();
        showNotification('Student added successfully!', 'success');
    }
}

// Render student list
function renderStudentList() {
    const studentList = document.getElementById('studentList');
    const skeleton = document.getElementById('studentLoadingSkeleton');
    const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
    
    // Hide skeleton when rendering
    if (skeleton) {
        skeleton.classList.add('hidden');
    }
    
    const filteredStudents = availableStudents.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.rollNo.includes(searchTerm)
    );

    // Clear existing student items only (not skeleton)
    const existingItems = studentList.querySelectorAll('.student-item');
    existingItems.forEach(item => item.remove());

    if (filteredStudents.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-gray-500 text-center py-4 student-item';
        emptyMsg.textContent = 'No students available';
        studentList.appendChild(emptyMsg);
        return;
    }

    const studentsHTML = filteredStudents.map(student => `
        <div class="flex items-center justify-between p-3 bg-white rounded student-item"
             data-rollno="${student.rollNo}">
            <div class="flex-1">
                <p class="font-semibold text-gray-900 text-sm">${student.name}</p>
                <p class="text-xs text-gray-500">${student.rollNo} <span class="text-gray-400">| Sec ${student.section}</span></p>
            </div>
            <button class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition text-xs font-semibold add-student-btn border border-black">
                [+ADD]
            </button>
        </div>
    `).join('');
    
    // Append after skeleton
    studentList.insertAdjacentHTML('beforeend', studentsHTML);

    // Attach click handlers
    document.querySelectorAll('.add-student-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rollNo = e.target.closest('.student-item').dataset.rollno;
            addStudentToTeam(rollNo);
        });
    });
}

// Add student to current team
function addStudentToTeam(rollNo) {
    if (selectedForTeam.length >= 4) {
        showNotification('Team is full! Maximum 4 members allowed.', 'warning');
        return;
    }

    const student = availableStudents.find(s => s.rollNo === rollNo);
    if (student) {
        selectedForTeam.push(student);
        availableStudents = availableStudents.filter(s => s.rollNo !== rollNo);
        renderStudentList();
        renderCurrentTeam();
        updateStatistics();
    }
}

// Remove student from current team
function removeStudentFromTeam(rollNo) {
    const student = selectedForTeam.find(s => s.rollNo === rollNo);
    if (student) {
        availableStudents.push(student);
        selectedForTeam = selectedForTeam.filter(s => s.rollNo !== rollNo);
        availableStudents.sort((a, b) => a.name.localeCompare(b.name));
        renderStudentList();
        renderCurrentTeam();
        updateStatistics();
    }
}

// Render current team being formed
function renderCurrentTeam() {
    const selectedStudentsDiv = document.getElementById('selectedStudents');
    const emptyMsg = document.getElementById('emptyTeamMsg');
    const createBtn = document.getElementById('createTeamBtn');

    if (selectedForTeam.length === 0) {
        emptyMsg.style.display = 'block';
        selectedStudentsDiv.innerHTML = '';
        createBtn.disabled = true;
    } else {
        emptyMsg.style.display = 'none';
        selectedStudentsDiv.innerHTML = selectedForTeam.map((student, index) => `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded border border-dashed border-gray-400">
                <div class="flex items-center gap-2">
                    <span class="bg-black text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold">
                        ${index + 1}
                    </span>
                    <div>
                        <p class="font-semibold text-sm">${student.name}</p>
                        <p class="text-xs text-gray-500">${student.rollNo} <span class="text-gray-400">| Sec ${student.section}</span></p>
                    </div>
                </div>
                <button class="text-gray-600 hover:text-black remove-student-btn font-bold" data-rollno="${student.rollNo}">
                    [X]
                </button>
            </div>
        `).join('');

        createBtn.disabled = selectedForTeam.length !== 4;

        // Attach remove handlers
        document.querySelectorAll('.remove-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rollNo = e.target.closest('.remove-student-btn').dataset.rollno;
                removeStudentFromTeam(rollNo);
            });
        });
    }
}

// Create team
function createTeam() {
    if (selectedForTeam.length !== 4) {
        showNotification('Please select exactly 4 students for a team.', 'warning');
        return;
    }

    const teamName = document.getElementById('teamName').value.trim() || `Team ${teams.length + 1}`;
    
    teams.push({
        name: teamName,
        members: [...selectedForTeam],
        createdAt: new Date().toISOString()
    });

    selectedForTeam = [];
    document.getElementById('teamName').value = '';
    
    saveTeamToFirebase(teams[teams.length - 1]);
    renderCurrentTeam();
    updateStatistics();
    
    showNotification('Team created successfully!', 'success');
}

// Clear current team selection
function clearTeam() {
    selectedForTeam.forEach(student => {
        availableStudents.push(student);
    });
    availableStudents.sort((a, b) => a.name.localeCompare(b.name));
    selectedForTeam = [];
    document.getElementById('teamName').value = '';
    
    renderStudentList();
    renderCurrentTeam();
    updateStatistics();
}

// Render all formed teams
function renderTeams() {
    const teamsList = document.getElementById('teamsList');
    
    if (teams.length === 0) {
        teamsList.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-2">No teams formed yet</p>';
        return;
    }

    teamsList.innerHTML = teams.map((team, teamIndex) => `
        <div class="team-card rounded p-4">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-dashed border-gray-400">
                <h3 class="font-bold text-base text-gray-900">
                    <span class="text-gray-500">#${teamIndex + 1}</span> ${team.name}
                </h3>
                <button class="text-gray-600 hover:text-black delete-team-btn text-xs font-bold" data-index="${teamIndex}">
                    [DELETE]
                </button>
            </div>
            <div class="space-y-2">
                ${team.members.map((member, index) => `
                    <div class="bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                        <div class="flex items-center gap-2">
                            <span class="bg-black text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                                ${index + 1}
                            </span>
                            <div class="flex-1">
                                <p class="font-semibold text-sm">${member.name}</p>
                                <p class="text-xs text-gray-500">${member.rollNo} <span class="text-gray-400">| Sec ${member.section}</span></p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Attach delete handlers
    document.querySelectorAll('.delete-team-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.delete-team-btn').dataset.index);
            deleteTeam(index);
        });
    });
}

// Delete a team
function deleteTeam(index) {
    if (confirm('Are you sure you want to delete this team?')) {
        const team = teams[index];
        team.members.forEach(member => {
            availableStudents.push(member);
        });
        availableStudents.sort((a, b) => a.name.localeCompare(b.name));
        
        const firebaseKey = team.firebaseKey;
        teams.splice(index, 1);
        
        deleteTeamFromFirebase(firebaseKey);
        renderStudentList();
        updateStatistics();
        
        showNotification('Team deleted successfully!', 'success');
    }
}

// Update statistics
function updateStatistics() {
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('teamsFormed').textContent = teams.length;
    
    const assignedCount = teams.length * 4;
    document.getElementById('assignedStudents').textContent = assignedCount;
    document.getElementById('unassignedStudents').textContent = students.length - assignedCount;
}

// Export to Excel (Admin only)
function exportToExcel() {
    if (!isAdmin) {
        showNotification('Admin login required to export!', 'warning');
        openAdminModal();
        return;
    }
    
    if (teams.length === 0) {
        showNotification('No teams to export!', 'warning');
        return;
    }

    // Prepare data for Excel
    const excelData = [];
    let currentRow = 0;
    
    // Add header section
    excelData.push(['Data Mining and Data Warehousing - Academic Project']);
    excelData.push(['MCA (Section A & B) - Team Formation']);
    excelData.push(['Generated on: ' + new Date().toLocaleString('en-IN', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
    })]);
    excelData.push([]);
    currentRow = 4;
    
    // Track rows for styling
    const teamHeaderRows = [];
    const tableHeaderRows = [];
    const summaryStartRow = currentRow;
    
    // Add teams
    teams.forEach((team, teamIndex) => {
        teamHeaderRows.push(currentRow);
        excelData.push([`Team ${teamIndex + 1}: ${team.name}`]);
        currentRow++;
        
        tableHeaderRows.push(currentRow);
        excelData.push(['S.No', 'Student Name', 'Roll Number', 'Section']);
        currentRow++;
        
        team.members.forEach((member, index) => {
            excelData.push([index + 1, member.name, member.rollNo, member.section]);
            currentRow++;
        });
        
        excelData.push([]);
        currentRow++;
    });

    // Add summary section
    const summaryRow = currentRow;
    excelData.push(['SUMMARY']);
    currentRow++;
    excelData.push(['Metric', 'Count']);
    currentRow++;
    excelData.push(['Total Students in Database', students.length]);
    excelData.push(['Teams Formed', teams.length]);
    excelData.push(['Students Assigned to Teams', teams.length * 4]);
    excelData.push(['Students Not Yet Assigned', students.length - (teams.length * 4)]);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
        { wch: 12 },  // S.No / Metric
        { wch: 35 },  // Student Name
        { wch: 18 },  // Roll Number
        { wch: 12 }   // Section
    ];

    // Apply styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Style main header (row 0-2)
    for (let R = 0; R <= 2; R++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            font: { 
                bold: true, 
                sz: R === 0 ? 16 : (R === 1 ? 14 : 11),
                color: { rgb: R === 0 ? "FFFFFF" : "1F2937" }
            },
            alignment: { horizontal: "left", vertical: "center" },
            fill: { fgColor: { rgb: R === 0 ? "1E3A8A" : "E5E7EB" } }
        };
    }
    
    // Style team headers
    teamHeaderRows.forEach(row => {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = {
            font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "left", vertical: "center" },
            fill: { fgColor: { rgb: "334155" } },
            border: {
                top: { style: "medium", color: { rgb: "334155" } },
                bottom: { style: "medium", color: { rgb: "334155" } },
                left: { style: "medium", color: { rgb: "334155" } },
                right: { style: "medium", color: { rgb: "334155" } }
            }
        };
    });
    
    // Style table headers
    tableHeaderRows.forEach(row => {
        for (let C = 0; C <= 3; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
                font: { bold: true, sz: 11, color: { rgb: "1F2937" } },
                alignment: { horizontal: "center", vertical: "center" },
                fill: { fgColor: { rgb: "CBD5E1" } },
                border: {
                    top: { style: "thin", color: { rgb: "64748B" } },
                    bottom: { style: "thin", color: { rgb: "64748B" } },
                    left: { style: "thin", color: { rgb: "64748B" } },
                    right: { style: "thin", color: { rgb: "64748B" } }
                }
            };
        }
    });
    
    // Style student rows (alternating colors)
    tableHeaderRows.forEach(headerRow => {
        for (let R = headerRow + 1; R < headerRow + 5; R++) {
            const isEven = (R - headerRow) % 2 === 0;
            for (let C = 0; C <= 3; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = {
                    font: { sz: 10, color: { rgb: "1F2937" } },
                    alignment: { 
                        horizontal: C === 0 ? "center" : "left", 
                        vertical: "center" 
                    },
                    fill: { fgColor: { rgb: isEven ? "F1F5F9" : "FFFFFF" } },
                    border: {
                        top: { style: "thin", color: { rgb: "CBD5E1" } },
                        bottom: { style: "thin", color: { rgb: "CBD5E1" } },
                        left: { style: "thin", color: { rgb: "CBD5E1" } },
                        right: { style: "thin", color: { rgb: "CBD5E1" } }
                    }
                };
            }
        }
    });
    
    // Style summary section
    const summaryHeaderCell = XLSX.utils.encode_cell({ r: summaryRow, c: 0 });
    if (ws[summaryHeaderCell]) {
        ws[summaryHeaderCell].s = {
            font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "left", vertical: "center" },
            fill: { fgColor: { rgb: "1E40AF" } },
            border: {
                top: { style: "medium", color: { rgb: "1E40AF" } },
                bottom: { style: "medium", color: { rgb: "1E40AF" } },
                left: { style: "medium", color: { rgb: "1E40AF" } },
                right: { style: "medium", color: { rgb: "1E40AF" } }
            }
        };
    }
    
    // Style summary table header
    for (let C = 0; C <= 1; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: summaryRow + 1, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            font: { bold: true, sz: 11, color: { rgb: "1F2937" } },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "BFDBFE" } },
            border: {
                top: { style: "thin", color: { rgb: "3B82F6" } },
                bottom: { style: "thin", color: { rgb: "3B82F6" } },
                left: { style: "thin", color: { rgb: "3B82F6" } },
                right: { style: "thin", color: { rgb: "3B82F6" } }
            }
        };
    }
    
    // Style summary data rows
    for (let R = summaryRow + 2; R <= summaryRow + 5; R++) {
        for (let C = 0; C <= 1; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = {
                font: { sz: 10, color: { rgb: "1F2937" }, bold: C === 1 },
                alignment: { horizontal: C === 0 ? "left" : "center", vertical: "center" },
                fill: { fgColor: { rgb: "EFF6FF" } },
                border: {
                    top: { style: "thin", color: { rgb: "93C5FD" } },
                    bottom: { style: "thin", color: { rgb: "93C5FD" } },
                    left: { style: "thin", color: { rgb: "93C5FD" } },
                    right: { style: "thin", color: { rgb: "93C5FD" } }
                }
            };
        }
    }

    // Merge cells for headers
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push(
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Main title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Subtitle
        { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }  // Date
    );
    
    // Merge team name cells
    teamHeaderRows.forEach(row => {
        ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 3 } });
    });
    
    // Merge summary header
    ws['!merges'].push({ s: { r: summaryRow, c: 0 }, e: { r: summaryRow, c: 3 } });

    XLSX.utils.book_append_sheet(wb, ws, 'Team Formation');

    // Generate filename with date
    const filename = `DWDM_Academic_Project_Teams_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
    
    showNotification('Excel file exported successfully!', 'success');
}

// Reset all data (Admin only)
function resetAll() {
    if (!isAdmin) {
        showNotification('Admin login required to reset teams!', 'warning');
        openAdminModal();
        return;
    }
    
    if (confirm('Are you sure you want to reset all teams? This action cannot be undone.')) {
        if (db) {
            db.ref('teams').remove().then(() => {
                selectedForTeam = [];
                showNotification('All teams have been reset!', 'success');
            });
        } else {
            teams = [];
            availableStudents = [...students];
            selectedForTeam = [];
            
            localStorage.removeItem('mcaTeams');
            
            renderStudentList();
            renderCurrentTeam();
            renderTeams();
            updateStatistics();
            
            showNotification('All data has been reset!', 'success');
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-gray-800',
        warning: 'bg-gray-600',
        error: 'bg-black',
        info: 'bg-gray-700'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Attach event listeners
function attachEventListeners() {
    document.getElementById('searchStudent').addEventListener('input', renderStudentList);
    document.getElementById('createTeamBtn').addEventListener('click', createTeam);
    document.getElementById('clearTeamBtn').addEventListener('click', clearTeam);
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('resetAllBtn').addEventListener('click', resetAll);
    
    // New student form listeners
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        document.getElementById('addStudentForm').classList.toggle('hidden');
    });
    
    document.getElementById('saveNewStudentBtn').addEventListener('click', addNewStudent);
    
    document.getElementById('cancelNewStudentBtn').addEventListener('click', () => {
        document.getElementById('newStudentName').value = '';
        document.getElementById('newStudentRoll').value = '';
        document.getElementById('newStudentSection').value = '';
        document.getElementById('addStudentForm').classList.add('hidden');
    });
    
    // Admin login listeners
    document.getElementById('adminLoginBtn').addEventListener('click', openAdminModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeAdminModal);
    document.getElementById('loginSubmitBtn').addEventListener('click', adminLogin);
    
    // Allow Enter key to submit login
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
    
    // Close modal on outside click
    document.getElementById('adminModal').addEventListener('click', (e) => {
        if (e.target.id === 'adminModal') {
            closeAdminModal();
        }
    });
    
    // Toggle password visibility
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        });
    }
}

// Hide splash screen
function hideSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            // Only show loading skeleton if data is not yet loaded
            if (db && !dataLoaded) {
                showLoading();
            }
        }, 500);
    }
}

// Countdown Timer
function updateCountdown() {
    // Set deadline to next Wednesday at 11:59 PM
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 3 = Wednesday
    
    // Calculate days until next Wednesday
    let daysUntilWednesday = (3 - currentDay + 7) % 7;
    if (daysUntilWednesday === 0 && now.getHours() >= 23 && now.getMinutes() >= 59) {
        daysUntilWednesday = 7; // If it's Wednesday night, set to next Wednesday
    }
    
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + daysUntilWednesday);
    deadline.setHours(23, 59, 59, 999);
    
    const timeDiff = deadline - now;
    
    const countdownEl = document.getElementById('countdown');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (timeDiff <= 0) {
        // Deadline passed
        timerDisplay.innerHTML = '<span class="text-red-700">⚠️ DEADLINE PASSED</span>';
        countdownEl.classList.add('expired');
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Format display
    let displayText = '';
    if (days > 0) {
        displayText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
        displayText = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        displayText = `${minutes}m ${seconds}s`;
    }
    
    timerDisplay.textContent = displayText;
    
    // Add urgent class if less than 24 hours
    if (timeDiff < 24 * 60 * 60 * 1000) {
        countdownEl.classList.add('urgent');
    } else {
        countdownEl.classList.remove('urgent');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add continue button listener
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', hideSplashScreen);
    }
    
    // Also allow Enter key or Escape key to continue
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Enter' || e.key === 'Escape') {
            hideSplashScreen();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000); // Update every second
    
    init();
});
