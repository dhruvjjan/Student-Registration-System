
// Global variable to track whether we are editing a record (-1 means new record)
let editIndex = -1;

// Retrieve stored students from local storage or return an empty array
function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

// Save students array to local storage
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render the table of student records
function displayStudents() {
    const students = getStudents();
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    students.forEach((student, index) => {
        const tr = document.createElement('tr');

        // Create table cells for each field
        const nameTd = document.createElement('td');
        nameTd.textContent = student.name;
        tr.appendChild(nameTd);

        const idTd = document.createElement('td');
        idTd.textContent = student.studentID;
        tr.appendChild(idTd);

        const emailTd = document.createElement('td');
        emailTd.textContent = student.email;
        tr.appendChild(emailTd);

        const contactTd = document.createElement('td');
        contactTd.textContent = student.contact;
        tr.appendChild(contactTd);

        // Actions cell with Edit and Delete buttons
        const actionsTd = document.createElement('td');

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginRight = '5px';
        editBtn.addEventListener('click', () => editStudent(index));
        actionsTd.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteStudent(index));
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
    });

    // Dynamically add vertical scrollbar if more than 5 records exist
    const recordsContainer = document.querySelector('.records-container');
    if (tbody.childElementCount > 5) {
        recordsContainer.style.overflowY = 'auto';
        recordsContainer.style.maxHeight = '300px';
    } else {
        recordsContainer.style.overflowY = 'visible';
        recordsContainer.style.maxHeight = 'none';
    }
}

// Add a new student or update an existing record
function addOrUpdateStudent(e) {
    e.preventDefault(); // Prevent form from submitting normally

    const form = document.getElementById('studentForm');
    
    // Use browser's built-in validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get values from input fields and trim whitespace
    const name = document.getElementById('name').value.trim();
    const studentID = document.getElementById('studentID').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    const students = getStudents();
    const studentData = { name, studentID, email, contact };

    // If editIndex is -1, we're adding a new record; otherwise, update the record
    if (editIndex === -1) {
        students.push(studentData);
    } else {
        students[editIndex] = studentData;
        editIndex = -1; // Reset editIndex after updating
    }

    saveStudents(students);
    displayStudents();
    form.reset();
}

// Load a student's data into the form for editing
function editStudent(index) {
    const students = getStudents();
    const student = students[index];

    document.getElementById('name').value = student.name;
    document.getElementById('studentID').value = student.studentID;
    document.getElementById('email').value = student.email;
    document.getElementById('contact').value = student.contact;

    editIndex = index; // Set current index for editing
}

// Delete a student record
function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        const students = getStudents();
        students.splice(index, 1);
        saveStudents(students);
        displayStudents();
    }
}

// Add event listener for form submission
document.getElementById('studentForm').addEventListener('submit', addOrUpdateStudent);

// Initial display of student records on page load
displayStudents();
