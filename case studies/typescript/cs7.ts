// Available Roles
enum Roles {
    Doctor = "Doctor",
    Nurse = "Nurse",
    Admin = "Admin"
}

interface Staff {
    id: string;
    name: string;
    role: Roles;
}

// Array of staff members
const staffMembers: Staff[] = [
    {
        id: "1",
        name: "Dr. Nilashis",
        role: Roles.Doctor
    },
    {
        id: "2",
        name: "Ms. Carla",
        role: Roles.Nurse
    },
    {
        id: "3",
        name: "Mr. Bob",
        role: Roles.Admin
    }
];

// Function to access a staff member detail
function detail(staff: Staff) {
    console.log(`ID: ${staff.id}, Name: ${staff.name}, Role: ${staff.role}`);
}

// Function to show summary of staff members
function summary() {
    console.log("Staff Summary:");
    staffMembers.map(detail);
}

summary();