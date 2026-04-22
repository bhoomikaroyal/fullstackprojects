<script type="module">
    import * as THREE from 'three';
    
    // ==================== THREE.JS SETUP ====================
    const canvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 30;
    
    // Particle System
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x00d4aa);
    const color2 = new THREE.Color(0x00a080);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;
      
      const mixRatio = Math.random();
      const color = color1.clone().lerp(color2, mixRatio);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        uniform float uTime;
        
        void main() {
          vColor = aColor;
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(uTime * 0.3 + position.y * 0.1) * 1.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Floating geometric shapes
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TetrahedronGeometry(1.5, 0)
    ];
    
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4aa : 0x00a080,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 10
      );
      mesh.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.5 + 0.3,
        floatOffset: Math.random() * Math.PI * 2
      };
      
      shapes.push(mesh);
      scene.add(mesh);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
      requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();
      particleMaterial.uniforms.uTime.value = elapsed;
      
      particles.rotation.y = mouseX * 0.1;
      particles.rotation.x = mouseY * 0.05;
      
      shapes.forEach((shape, i) => {
        shape.rotation.x += shape.userData.rotationSpeed;
        shape.rotation.y += shape.userData.rotationSpeed * 0.8;
        shape.position.y += Math.sin(elapsed * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
      });
      
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // ==================== DATA ====================
    const eventsData = [
      {
        id: 1,
        name: "TechFest 2024",
        category: "technical",
        date: "2026-03-31",
        time: "09:00",
        venue: "Main Auditorium",
        description: "Annual technical festival featuring coding competitions, robotics, and innovation showcases.",
        capacity: 500,
        registered: 342,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop"
      },
      {
        id: 2,
        name: "Cultural Night",
        category: "cultural",
        date: "2026-03-31",
        time: "18:00",
        venue: "Open Air Theatre",
        description: "A vibrant evening of music, dance, and drama performances by students.",
        capacity: 800,
        registered: 654,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop"
      },
      {
        id: 3,
        name: "AI Workshop",
        category: "workshop",
        date: "2026-03-31",
        time: "10:00",
        venue: "CS Lab 1",
        description: "Hands-on workshop on machine learning and artificial intelligence fundamentals.",
        capacity: 50,
        registered: 47,
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop"
      },
      {
        id: 4,
        name: "Career Seminar",
        category: "seminar",
        date: "2026-03-31",
        time: "14:00",
        venue: "Conference Hall A",
        description: "Industry experts share insights on career paths and opportunities in tech.",
        capacity: 200,
        registered: 156,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
      },
      {
        id: 5,
        name: "Hackathon",
        category: "technical",
        date: "2026-03-31",
        time: "00:00",
        venue: "Innovation Hub",
        description: "24-hour coding challenge to build innovative solutions for real-world problems.",
        capacity: 100,
        registered: 89,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop"
      },
      {
        id: 6,
        name: "Dance Workshop",
        category: "workshop",
        date: "2026-03-31",
        time: "16:00",
        venue: "Dance Studio",
        description: "Learn contemporary and hip-hop dance forms from professional instructors.",
        capacity: 30,
        registered: 28,
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=250&fit=crop"
      },
      {
        id: 7,
        name: "Photography Exhibition",
        category: "cultural",
        date: "2026-03-31",
        time: "10:00",
        venue: "Art Gallery",
        description: "Showcase of student photography capturing campus life and beyond.",
        capacity: 150,
        registered: 78,
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=250&fit=crop"
      },
      {
        id: 8,
        name: "Research Symposium",
        category: "seminar",
        date: "2026-03-31",
        time: "09:00",
        venue: "Seminar Hall",
        description: "Presentation of cutting-edge research projects by final year students.",
        capacity: 120,
        registered: 95,
        image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&h=250&fit=crop"
      }
    ];
    
    let registrations = [];
    let currentUser = null;
    let currentEventId = null;
    
    // ==================== DOM ELEMENTS ====================
    const loginPage = document.getElementById('login-page');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplay = document.getElementById('user-display');
    const adminNav = document.getElementById('admin-nav');
    const myRegNav = document.getElementById('my-reg-nav');
    
    const homeSection = document.getElementById('home-section');
    const eventsSection = document.getElementById('events-section');
    const myRegistrationsSection = document.getElementById('my-registrations-section');
    const adminSection = document.getElementById('admin-section');
    
    const featuredEvents = document.getElementById('featured-events');
    const eventsList = document.getElementById('events-list');
    const registrationsList = document.getElementById('registrations-list');
    const adminRegistrationsTable = document.getElementById('admin-registrations-table');
    
    const registrationModal = document.getElementById('registration-modal');
    const registrationForm = document.getElementById('registration-form');
    const createEventForm = document.getElementById('create-event-form');
    
    // ==================== FUNCTIONS ====================
    function showToast(message) {
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toast-message');
      toastMessage.textContent = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
      }, 3000);
    }
    
    function renderFeaturedEvents() {
      const featured = eventsData.slice(0, 3);
      featuredEvents.innerHTML = featured.map((event, index) => createEventCard(event, index)).join('');
    }
    
    function renderAllEvents(filter = 'all') {
      const filtered = filter === 'all' 
        ? eventsData 
        : eventsData.filter(e => e.category === filter);
      
      eventsList.innerHTML = filtered.map((event, index) => createEventCard(event, index)).join('');
    }
    
    function createEventCard(event, index) {
      const progress = (event.registered / event.capacity) * 100;
      const categoryClass = `category-${event.category}`;
      const dateFormatted = new Date(event.date).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      });
      
      return `
        <div class="glass-card event-card overflow-hidden scroll-reveal" style="transition-delay: ${index * 0.1}s">
          <div class="h-40 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg)] relative overflow-hidden">
            <img src="${event.image}" alt="${event.name}" class="w-full h-full object-cover opacity-60">
            <div class="absolute top-4 left-4">
              <span class="category-badge ${categoryClass}">${event.category}</span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">${event.name}</h3>
            <p class="text-[var(--muted)] text-sm mb-4 line-clamp-2">${event.description}</p>
            
            <div class="flex items-center gap-4 text-sm text-[var(--muted)] mb-4">
              <div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                ${dateFormatted}
              </div>
              <div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${event.venue}
              </div>
            </div>
            
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-[var(--muted)]">${event.registered}/${event.capacity} registered</span>
                <span class="text-[var(--accent)]">${Math.round(progress)}%</span>
              </div>
              <div class="h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[var(--accent)] to-[#00a080] rounded-full transition-all duration-500" style="width: ${progress}%"></div>
              </div>
            </div>
            
            <button class="btn-primary w-full" onclick="openRegistrationModal(${event.id})">
              Register Now
            </button>
          </div>
        </div>
      `;
    }
    
    function renderMyRegistrations() {
      const userRegs = registrations.filter(r  => r.email === currentUser?.email);
      
      if (userRegs.length === 0) {
        registrationsList.innerHTML = `
          <div class="glass-card p-8 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1" class="mx-auto mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <h3 class="text-xl font-semibold mb-2">No Registrations Yet</h3>
            <p class="text-[var(--muted)] mb-4">You haven't registered for any events.</p>
            <button class="btn-primary" onclick="showSection('events')">Browse Events</button>
          </div>
        `;
        return;
      }
      
      registrationsList.innerHTML = userRegs.map((reg, i) => {
        const event = eventsData.find(e => e.id === reg.eventId);
        if (!event) return '';
        
        return `
          <div class="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 scroll-reveal" style="transition-delay: ${i * 0.1}s">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#00a080] flex items-center justify-center text-[var(--bg)] font-bold text-xl">
                ${event.name.charAt(0)}
              </div>
              <div>
                <h3 class="font-semibold text-lg">${event.name}</h3>
                <p class="text-[var(--muted)] text-sm">${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${event.time}</p>
                <p class="text-[var(--muted)] text-sm">${event.venue}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="category-badge category-${event.category}">${event.category}</span>
              <span class="px-3 py-1 rounded-full bg-[rgba(0,212,170,0.2)] text-[var(--accent)] text-sm font-medium">Confirmed</span>
            </div>
          </div>
        `;
      }).join('');
    }
    
    function renderAdminRegistrations() {
      const totalRegs = registrations.length;
      document.getElementById('total-registrations').textContent = totalRegs;
      
      if (registrations.length === 0) {
        adminRegistrationsTable.innerHTML = `
          <tr>
            <td colspan="5" class="py-8 text-center text-[var(--muted)]">No registrations yet</td>
          </tr>
        `;
        return;
      }
      
      adminRegistrationsTable.innerHTML = registrations.map((reg, i) => {
        const event = eventsData.find(e => e.id === reg.eventId);
        return `
          <tr class="table-row border-b border-[var(--border)]">
            <td class="py-4 px-4">
              <div class="font-medium">${reg.name}</div>
              <div class="text-sm text-[var(--muted)]">${reg.email}</div>
            </td>
            <td class="py-4 px-4">${event?.name || 'Unknown'}</td>
            <td class="py-4 px-4 text-[var(--muted)]">${new Date().toLocaleDateString()}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full bg-[rgba(0,212,170,0.2)] text-[var(--accent)] text-sm">Confirmed</span>
            </td>
            <td class="py-4 px-4">
              <button class="text-[var(--danger)] hover:underline text-sm" onclick="deleteRegistration(${i})">Remove</button>
            </td>
          </tr>
        `;
      }).join('');
    }
    
    // ==================== GLOBAL FUNCTIONS ====================
    window.showSection = function(sectionName) {
      // Hide all sections
      homeSection.classList.add('hidden');
      eventsSection.classList.add('hidden');
      myRegistrationsSection.classList.add('hidden');
      adminSection.classList.add('hidden');
      
      // Update nav
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      
      // Show target section
      switch(sectionName) {
        case 'home':
          homeSection.classList.remove('hidden');
          break;
        case 'events':
          eventsSection.classList.remove('hidden');
          renderAllEvents();
          break;
        case 'my-registrations':
          myRegistrationsSection.classList.remove('hidden');
          renderMyRegistrations();
          break;
        case 'admin':
          adminSection.classList.remove('hidden');
          renderAdminRegistrations();
          break;
      }
      
      // Scroll reveal
      setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
          el.classList.add('revealed');
        });
      }, 100);
    };
    
    window.filterEvents = function(category) {
      showSection('events');
      setTimeout(() => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.filter === category);
        });
        renderAllEvents(category);
        
        setTimeout(() => {
          document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('revealed');
          });
        }, 100);
      }, 100);
    };
    
    window.openRegistrationModal = function(eventId) {
      currentEventId = eventId;
      const event = eventsData.find(e => e.id === eventId);
      if (!event) return;
      
      document.getElementById('modal-event-name').textContent = event.name;
      document.getElementById('modal-event-details').textContent = 
        `${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${event.time} | ${event.venue}`;
      
      // Pre-fill if user is logged in
      if (currentUser) {
        document.getElementById('reg-name').value = currentUser.username || '';
      }
      
      registrationModal.classList.add('active');
    };
    
    window.closeModal = function() {
      registrationModal.classList.remove('active');
      registrationForm.reset();
      currentEventId = null;
    };
    
    window.deleteRegistration = function(index) {
      registrations.splice(index, 1);
      renderAdminRegistrations();
      showToast('Registration removed');
    };
    
    window.exportData = function() {
      let csv = 'Name,Email,Department,Year,Event,Date\n';
      registrations.forEach(reg => {
        const event = eventsData.find(e => e.id === reg.eventId);
        csv += `${reg.name},${reg.email},${reg.department},${reg.year},${event?.name || 'Unknown'},${new Date().toLocaleDateString()}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('CSV exported successfully');
    };
    
    // ==================== EVENT LISTENERS ====================
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const role = document.querySelector('input[name="role"]:checked').value;
      
      currentUser = {
        username,
        email: `${username.toLowerCase().replace(/\s/g, '')}@campus.edu`,
        role
      };
      
      loginPage.classList.remove('active');
      mainApp.classList.add('active');
      userDisplay.textContent = `Hi, ${username}`;
      
      if (role === 'admin') {
        adminNav.style.display = 'block';
        myRegNav.style.display = 'none';
      } else {
        adminNav.style.display = 'none';
        myRegNav.style.display = 'block';
      }
      
      renderFeaturedEvents();
      
      setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
          el.classList.add('revealed');
        });
      }, 100);
      
      showToast(`Welcome, ${username}!`);
    });
    
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      mainApp.classList.remove('active');
      loginPage.classList.add('active');
      loginForm.reset();
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const page = link.dataset.page;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        showSection(page);
      });
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAllEvents(btn.dataset.filter);
        
        setTimeout(() => {
          document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('revealed');
          });
        }, 100);
      });
    });
    
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const registration = {
        eventId: currentEventId,
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        department: document.getElementById('reg-department').value,
        year: document.getElementById('reg-year').value,
        date: new Date().toISOString()
      };
      
      registrations.push(registration);
      
      // Update event registered count
      const event = eventsData.find(e => e.id === currentEventId);
      if (event) {
        event.registered++;
      }
      
      closeModal();
      showToast('Successfully registered!');
    });
    
    createEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newEvent = {
        id: eventsData.length + 1,
        name: document.getElementById('event-name').value,
        category: document.getElementById('event-category').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        venue: document.getElementById('event-venue').value,
        description: document.getElementById('event-description').value,
        capacity: parseInt(document.getElementById('event-capacity').value),
        registered: 0,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
      };
      
      eventsData.push(newEvent);
      createEventForm.reset();
      showToast('Event created successfully!');
    });
    
    // Close modal on overlay click
    registrationModal.addEventListener('click', (e) => {
      if (e.target === registrationModal) {
        closeModal();
      }
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && registrationModal.classList.contains('active')) {
        closeModal();
      }
    });
    
    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  </script>