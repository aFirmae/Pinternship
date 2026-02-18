// Profile type
type Profile = {
    username: string;
    bio: string | null;
    avatarUrl?: string;
};

// User Profiles
const userProfiles: Profile[] = [
    {
        username: "nilashis37",
        bio: "Hello, I am Nilashis",
        avatarUrl: "https://nilashis.in/gallery/",
    },
    {
        username: "john123",
        bio: null,
    },
];

// Function to display profile information
function showProfile(profile: Profile) {
    console.log(`Username: ${profile.username}`);
    if (profile.bio) {
        console.log(`Bio: ${profile.bio}`);
    } else {
        console.log("Bio: No information available!");
    }
    if (profile.avatarUrl) {
        console.log(`Avatar URL: ${profile.avatarUrl}`);
    } else {
        console.log("Avatar URL: https://unsplash.com/illustrations/a-smiley-face-with-a-hat-on-top-of-it-vlGp55XDVow");
    }
}

showProfile(userProfiles[0]);
showProfile(userProfiles[1]);