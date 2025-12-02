let members = [];
let filteredMembers = [];
let isDarkMode = localStorage.getItem("theme") !== "light";

const splashScreen = document.getElementById("splash-screen");
const loadingBar = document.getElementById("loading-bar");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const filterToggle = document.getElementById("filter-toggle");
const filterOptions = document.getElementById("filter-options");
const roleFilter = document.getElementById("role-filter");
const skillFilter = document.getElementById("skill-filter");
const locationFilter = document.getElementById("location-filter");
const clearFilters = document.getElementById("clear-filters");
const filterIndicator = document.getElementById("filter-indicator");
const resultsCount = document.getElementById("results-count");
const membersGrid = document.getElementById("members-grid");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const retryBtn = document.getElementById("retry-btn");

function initSplash() {
    let progress = 0;
    const timer = setInterval(() => {
        progress += 2;
        loadingBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                splashScreen.classList.add("hidden");
            }, 500);
        }
    }, 30);
}

function initTheme() {
    if (!isDarkMode) document.body.classList.add("light-mode");
    updateThemeIcon();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateThemeIcon();
}

function updateThemeIcon() {
    themeToggle.innerHTML = isDarkMode
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="6" fill="white"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M10 2v2m0 12v2m8-8h-2M4 10H2m12.12-6.12-1.41 1.41M5.29 14.71l-1.41 1.41m0-11.42 1.41 1.41m11.42 11.42-1.41-1.41" stroke="black"/></svg>`;
}

function init3DBackground() {
    const container = document.getElementById("three-container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const lights = [
        { color: 0x4285f4, pos: [10, 10, 10] },
        { color: 0xea4335, pos: [-10, -10, -10] },
        { color: 0x34a853, pos: [0, 10, -10] }
    ];

    lights.forEach(l => {
        const light = new THREE.PointLight(l.color, 0.8, 100);
        light.position.set(...l.pos);
        scene.add(light);
    });

    const shapes = [];
    const colors = [0x4285f4, 0xea4335, 0xfbbc05, 0x34a853];
    const geometries = [
        new THREE.IcosahedronGeometry(1),
        new THREE.TorusGeometry(0.8, 0.3, 16, 32),
        new THREE.OctahedronGeometry(1),
        new THREE.TetrahedronGeometry(1),
        new THREE.SphereGeometry(0.8, 32, 32)
    ];

    for (let i = 0; i < 15; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = new THREE.MeshPhongMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.6,
            shininess: 100,
            wireframe: Math.random() > 0.7
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20 - 10
        );

        const scale = Math.random() * 0.8 + 0.4;
        mesh.scale.set(scale, scale, scale);

        mesh.userData = {
            rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y
        };

        shapes.push(mesh);
        scene.add(mesh);
    }

    const particlesGeom = new THREE.BufferGeometry();
    const particleCount = 500;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 50;
        posArray[i + 1] = (Math.random() - 0.5) * 50;
        posArray[i + 2] = (Math.random() - 0.5) * 50;
    }

    particlesGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particles = new THREE.Points(
        particlesGeom,
        new THREE.PointsMaterial({ size: 0.05, color: 0x4285f4, transparent: true, opacity: 0.6 })
    );

    scene.add(particles);
    camera.position.z = 15;

    const animate = () => {
        const time = Date.now() * 0.001;

        shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;

            shape.position.y =
                shape.userData.originalY +
                Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.5;
        });

        particles.rotation.y = time * 0.02;
        particles.rotation.x = time * 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

async function fetchMembers() {
    try {
        showLoading();
        await new Promise(r => setTimeout(r, 800));

        const res = await fetch("members.json");
        if (!res.ok) throw new Error();

        const data = await res.json();
        members = [...data.members];
        filteredMembers = [...members];

        populateFilters();
        renderMembers();
        hideLoading();
    } catch {
        showError();
    }
}

function populateFilters() {
    const roles = [...new Set(members.map(m => m.role))].sort();
    const skills = [...new Set(members.flatMap(m => m.skills))].sort();
    const locations = [...new Set(members.map(m => m.location))].sort();

    roles.forEach(r => (roleFilter.innerHTML += `<option value="${r}">${r}</option>`));
    skills.forEach(s => (skillFilter.innerHTML += `<option value="${s}">${s}</option>`));
    locations.forEach(l => (locationFilter.innerHTML += `<option value="${l}">${l}</option>`));
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const r = roleFilter.value;
    const s = skillFilter.value;
    const l = locationFilter.value;

    filteredMembers = members.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(query) || m.bio.toLowerCase().includes(query);
        const matchRole = !r || m.role === r;
        const matchSkill = !s || m.skills.includes(s);
        const matchLocation = !l || m.location === l;
        return matchSearch && matchRole && matchSkill && matchLocation;
    });

    updateFilterIndicator();
    renderMembers();
}

function updateFilterIndicator() {
    const enabled = roleFilter.value || skillFilter.value || locationFilter.value;
    filterIndicator.classList.toggle("visible", enabled);
    clearFilters.classList.toggle("visible", enabled);
}

function resetFilters() {
    roleFilter.value = "";
    skillFilter.value = "";
    locationFilter.value = "";
    searchInput.value = "";
    applyFilters();
}

function renderMembers() {
    resultsCount.innerHTML = `Showing ${filteredMembers.length} of ${members.length}`;

    if (filteredMembers.length === 0) {
        membersGrid.innerHTML = "";
        emptyState.classList.add("show");
        return;
    }

    emptyState.classList.remove("show");

    membersGrid.innerHTML = filteredMembers
        .map(
            m => `
        <div class="member-card">
            <img src="${m.photo}" alt="${m.name}">
            <h3>${m.name}</h3>
            <p class="role">${m.role}</p>
            <p class="location">${m.location}</p>
            <div class="skills">${m.skills.map(s => `<span>${s}</span>`).join("")}</div>
            <p class="bio">${m.bio}</p>
        </div>
    `
        )
        .join("");
}

function showLoading() {
    loadingState.classList.add("show");
    errorState.classList.remove("show");
    emptyState.classList.remove("show");
}

function hideLoading() {
    loadingState.classList.remove("show");
}

function showError() {
    loadingState.classList.remove("show");
    errorState.classList.add("show");
}

function initEventListeners() {
    themeToggle.addEventListener("click", toggleTheme);
    searchInput.addEventListener("input", applyFilters);

    filterToggle.addEventListener("click", () => {
        filterOptions.classList.toggle("show");
    });

    roleFilter.addEventListener("change", applyFilters);
    skillFilter.addEventListener("change", applyFilters);
    locationFilter.addEventListener("change", applyFilters);
    clearFilters.addEventListener("click", resetFilters);
    retryBtn.addEventListener("click", fetchMembers);
}

initSplash();
initTheme();
init3DBackground();
initEventListeners();
fetchMembers();
