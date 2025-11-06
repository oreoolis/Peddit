<template>
  <div class="landing-page" @mousemove="handleMouseMove">
    <!-- Hero Section with Interactive Dog -->
    <section class="hero-section py-5">
      <div class="container-fluid px-4 px-lg-5">
        <div class="row align-items-center g-5 justify-content-center">
          <div class="col-lg-5 col-xl-4 order-2 order-lg-1">
         <div class="hero-text-container mx-auto" style="max-width: 550px; text-align: left;">
            <h1 class="display-3 fw-bold mb-4">
              <span class="gradient-text">Peddit: </span>
              Your Pet's Health & Happiness, All in One Place
            </h1>
            <p class="lead text-muted mb-4">
              Join the ultimate social platform for pet owners. Manage health, discover recipes, and connect with a community that cares.
            </p>
            <button @click="navigateToAuth" class="btn btn-gradient btn-lg w-100 mb-3">
              Get Started Here!
              <svg width="20" height="20">
                <!-- SVG icon -->
              </svg>
            </button>
            <button @click="navigateToMap" class="btn btn-outline-primary btn-lg w-100 mb-4">
              📍 Find Pet Stores & Clinics Near Me
            </button>
            <div class="d-flex flex-row justify-content-center gap-5 pt-3">
              <div>
                <div class="fs-2 fw-bold">100+</div>
                <div class="text-muted">Active Users</div>
              </div>
              <div>
                <div class="fs-2 fw-bold">500+</div>
                <div class="text-muted">Recipes Shared</div>
              </div>
              <div>
                <div class="fs-2 fw-bold">300+</div>
                <div class="text-muted">Healthy Pets</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5 col-xl-4 order-1 order-lg-2">
            <div class="position-relative">
              <div class="hero-blur"></div>
              <div class="pets-container d-flex gap-4 justify-content-center align-items-center">
                 <!-- Interactive Dog -->
                <div class="pet-wrapper">
                  <svg width="300" height="300" viewBox="0 0 200 200" class="interactive-pet">
                    <!-- Dog head -->
                    <ellipse cx="100" cy="100" rx="60" ry="70" fill="#8B4513"/>
                    
                    <!-- Ears -->
                    <ellipse cx="60" cy="70" rx="25" ry="40" fill="#654321"/>
                    <ellipse cx="140" cy="70" rx="25" ry="40" fill="#654321"/>
                    
                    <!-- Snout -->
                    <ellipse cx="100" cy="120" rx="35" ry="25" fill="#D2691E"/>
                    
                    <!-- Nose -->
                    <ellipse cx="100" cy="115" rx="12" ry="10" fill="#000"/>
                    
                    <!-- Eyes (white part) -->
                    <circle cx="80" cy="85" r="12" fill="white"/>
                    <circle cx="120" cy="85" r="12" fill="white"/>
                    
                    <!-- Pupils that follow cursor -->
                    <circle :cx="dogLeftPupilX" :cy="dogLeftPupilY" r="6" fill="black" class="pupil"/>
                    <circle :cx="dogRightPupilX" :cy="dogRightPupilY" r="6" fill="black" class="pupil"/>
                    
                    <!-- Mouth -->
                    <path d="M 90 130 Q 100 135 110 130" stroke="#000" stroke-width="2" fill="none"/>
                  </svg>
                </div>

                <!-- Interactive Cat -->
                <div class="pet-wrapper">
                  <svg width="300" height="300" viewBox="0 0 200 200" class="interactive-pet">
                    <!-- Cat head -->
                    <ellipse cx="100" cy="110" rx="55" ry="60" fill="#FFA500"/>
                    
                    <!-- Cat ears (triangular) -->
                    <polygon points="65,70 50,35 80,60" fill="#FFA500"/>
                    <polygon points="135,70 150,35 120,60" fill="#FFA500"/>
                    <!-- Inner ears -->
                    <polygon points="65,70 58,45 72,62" fill="#FFB84D"/>
                    <polygon points="135,70 142,45 128,62" fill="#FFB84D"/>
                    
                    <!-- Eyes (white part) - cat eyes are more oval -->
                    <ellipse cx="80" cy="100" rx="14" ry="18" fill="white"/>
                    <ellipse cx="120" cy="100" rx="14" ry="18" fill="white"/>
                    
                    <!-- Pupils that follow cursor - vertical slits -->
                    <ellipse :cx="catLeftPupilX" :cy="catLeftPupilY" rx="3" ry="12" fill="black" class="pupil"/>
                    <ellipse :cx="catRightPupilX" :cy="catRightPupilY" rx="3" ry="12" fill="black" class="pupil"/>
                    
                    <!-- Nose -->
                    <polygon points="100,115 95,120 105,120" fill="#FF69B4"/>
                    
                    <!-- Mouth -->
                    <path d="M 100 120 L 100 125" stroke="#000" stroke-width="2"/>
                    <path d="M 100 125 Q 90 130 85 128" stroke="#000" stroke-width="2" fill="none"/>
                    <path d="M 100 125 Q 110 130 115 128" stroke="#000" stroke-width="2" fill="none"/>
                    
                    <!-- Whiskers -->
                    <line x1="50" y1="105" x2="20" y2="100" stroke="#333" stroke-width="1.5"/>
                    <line x1="50" y1="110" x2="20" y2="115" stroke="#333" stroke-width="1.5"/>
                    <line x1="150" y1="105" x2="180" y2="100" stroke="#333" stroke-width="1.5"/>
                    <line x1="150" y1="110" x2="180" y2="115" stroke="#333" stroke-width="1.5"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-5 bg-light">
      <div class="container-fluid px-4 px-lg-5">
        <div class="text-center mb-5">
          <h2 class="display-4 fw-bold mb-3">Everything Your Pet Needs</h2>
          <p class="lead text-muted">
            Comprehensive tools and features designed to keep your furry friends healthy, happy, and thriving.
          </p>
        </div>

        <div class="row g-4 justify-content-center">
          <div 
            v-for="(feature, index) in features"
            :key="index"
            class="col-sm-6 col-lg-4 mb-4"
            style="max-width: 350px;"
          >
            <div class="card h-100 border-0 shadow-sm feature-card">
              <div class="card-body p-4">
                <div class="feature-icon mb-4" v-html="feature.icon"></div>
                <h3 class="h4 fw-bold mb-3">{{ feature.title }}</h3>
                <p class="text-muted">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-5">
      <div class="container-fluid px-4 px-lg-5">
        <div class="text-center mb-5">
          <h2 class="display-4 fw-bold mb-3">Using Peddit is Easy</h2>
          <p class="lead text-muted">Just follow these 4 steps to take care of your pets.</p>
        </div>

        <div class="row g-4 justify-content-center">
          <div v-for="step in steps" :key="step.number" class="col-md-6 col-lg-3 text-center">
            <div class="step-number mb-4 mx-auto">{{ step.number }}</div>
            <h3 class="h5 fw-bold mb-3">{{ step.title }}</h3>
            <p class="text-muted">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- App Screenshots Carousel -->
    <section class="py-5 screenshots-section">
      <div class="container-fluid px-4 px-lg-5">
        <div class="text-center mb-5">
          <h2 class="display-4 fw-bold mb-3">See Peddit in Action</h2>
          <p class="lead text-muted">Real features, real results for your pets!</p>
        </div>

        <div class="carousel-container position-relative">
          <!-- Carousel Navigation -->
          <button 
            @click="previousScreenshot" 
            class="carousel-btn carousel-btn-left"
            :disabled="screenshotIndex === 0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <!-- Carousel Content -->
          <div class="carousel-content">
            <transition name="slide" mode="out-in">
              <div :key="screenshotIndex" class="screenshot-slide">
                <div class="row justify-content-center">
                  <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="card border-0 shadow screenshot-card">
                      <img 
                        :src="screenshots[screenshotIndex].image" 
                        :alt="screenshots[screenshotIndex].title" 
                        class="card-img-top"
                      >
                      <div class="card-body text-center p-4">
                        <h3 class="h4 fw-bold mb-3">{{ screenshots[screenshotIndex].title }}</h3>
                        <p class="text-muted">{{ screenshots[screenshotIndex].description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <button 
            @click="nextScreenshot" 
            class="carousel-btn carousel-btn-right"
            :disabled="screenshotIndex === screenshots.length - 1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Carousel Indicators -->
          <div class="carousel-indicators">
            <button
              v-for="(screenshot, index) in screenshots"
              :key="index"
              @click="screenshotIndex = index"
              :class="['indicator-dot', { active: index === screenshotIndex }]"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Section with Carousel -->
    <section id="community" class="py-5 community-section text-white">
      <div class="container-fluid px-4 px-lg-5">
        <div class="text-center mb-5">
          <h2 class="display-4 fw-bold mb-3">Join Our Growing Community</h2>
          <p class="lead">Thousands of pet parents sharing their journey with Peddit</p>
        </div>

        <!-- Community Carousel -->
        <div 
          class="carousel-container position-relative mb-5"
          @mouseenter="pauseAutoScroll"
          @mouseleave="resumeAutoScroll"
        >
          <!-- Carousel Navigation -->
          <button 
            @click="previousCommunity" 
            class="carousel-btn carousel-btn-left carousel-btn-community"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <!-- Carousel Content -->
          <div class="carousel-content">
            <transition name="slide" mode="out-in">
              <div :key="communityIndex" class="community-slide">
                <div class="row justify-content-center">
                  <div class="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div class="pixel-art-card">
                      <img 
                        :src="PetList[communityIndex].image" 
                        :alt="`${PetList[communityIndex].petName} - ${PetList[communityIndex].breed}`" 
                        class="img-fluid rounded-3"
                      >
                      <div class="pet-caption mt-3 text-center">
                        <h5 class="mb-2">{{ PetList[communityIndex].petName }}</h5>
                        <p class="mb-1">
                          <strong>Owner:</strong> {{ PetList[communityIndex].ownerName }}
                        </p>
                        <p class="mb-1">
                          <strong>Breed:</strong> {{ PetList[communityIndex].breed }}
                        </p>
                        <p class="mb-0">
                          <strong>Age:</strong> {{ PetList[communityIndex].age }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <button 
            @click="nextCommunity" 
            class="carousel-btn carousel-btn-right carousel-btn-community"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Carousel Indicators -->
          <div class="carousel-indicators">
            <button
              v-for="(art, index) in PetList"
              :key="index"
              @click="goToCommunitySlide(index)"
              :class="['indicator-dot', 'indicator-dot-white', { active: index === communityIndex }]"
            ></button>
          </div>
        </div>

        <div class="text-center">
          <button @click="navigateToAuth" class="btn btn-light btn-lg px-5 py-3">Join the Community Today!</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      mobileMenuOpen: false,
      dogLeftPupilX: 80,
      dogLeftPupilY: 85,
      dogRightPupilX: 120,
      dogRightPupilY: 85,
      catLeftPupilX: 80,
      catLeftPupilY: 100,
      catRightPupilX: 120,
      catRightPupilY: 100,
      screenshotIndex: 0,
      communityIndex: 0,
      autoScrollInterval: null,
      features: [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
          title: "Pet Health Dashboard",
          description: "Monitor nutrition, track multiple pets, and get personalized health recommendations based on your pet's unique needs."
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>`,
          title: "Recipe Finding",
          description: "Discover and share healthy meal plans created by the community. Find the perfect diet for your furry friend."
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
          title: "Social Community",
          description: "Connect with pet lovers worldwide, share moments, and get advice from experienced pet parents."
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
          title: "Smart Chatbot",
          description: "Get instant answers about pet nutrition and care. Our AI assistant is here to help 24/7."
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
          title: "Location Finding",
          description: "Find nearby pet stores and vet clinics with our map, updated with real-time availability and ratings from the community."
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
          title: "Nutrition Tracking",
          description: "Detailed daily nutrition targets based on your pet's breed, age, and weight. Keep your pet healthy and happy."
        }
      ],
      steps: [
        {
          number: 1,
          title: "Create Profile",
          description: "Set up your pet's profile with their details and health information"
        },
        {
          number: 2,
          title: "Get Recommendations",
          description: "Receive personalized meal plans and health tips"
        },
        {
          number: 3,
          title: "Track Progress",
          description: "Monitor your pet's health and nutrition journey"
        },
        {
          number: 4,
          title: "Connect & Share",
          description: "Join the community, share recipes and pet moments through posts"
        },
      ],
      screenshots: [
        {
          title: "Pet Health Dashboard",
          image: "../src/assets/dashboard.png",
          description: "Track detailed nutrition metrics and health data for all your pets in one beautiful interface."
        },
        {
          title: "Recipe Finding",
          image: "../src/assets/recipe.png",
          description: "Find trending recipes for dogs and cats, created by pet owners."
        },
        {
          title: "Social Community",
          image: "../src/assets/social.png",
          description: "Engage with the pet community, discover recipes, and share your pet's special moments."
        },
        {
          title: "Smart Chatbot",
          image: "../src/assets/chatbot.png",
          description: "Get instant, personalized meal plans and nutrition advice from our smart chatbot."
        },
        {
          title: "Location Finding",
          image: "../src/assets/location.png",
          description: "Find pet stores and vet clinics near you, sorted by rating, distance and opening hours."
        },
        {
          title: "Nutrition Tracking",
          image: "../src/assets/nutrition.png",
          description: "Check your pets' daily nutrition targets in detail to ensure that they are happy and healthy."
        }
      ],
      PetList: [
        {
          image: "../src/assets/toastie.jpg",
          ownerName: "Bernard Lo",
          petName: "Toastie",
          breed: "Persian Cat",
          age: "3 years old"
        },
        {
          image: "../src/assets/butter.jpg",
          ownerName: "Mok Heng Ngee",
          petName: "Butter",
          breed: "Ragdoll",
          age: "2 years old"
        },
        {
          image: "../src/assets/pitbull.jpg",
          ownerName: "Lawrence Wong",
          petName: "Bubbles",
          breed: "Pitbull",
          age: "5 years old"
        },
        {
          image: "../src/assets/ruffles.jpg",
          ownerName: "Kyong Jim Shim",
          petName: "Demon Slayer",
          breed: "Golden Retriever",
          age: "4 years old"
        },
        {
          image: "../src/assets/siamese.jpg",
          ownerName: "Amala Ratna",
          petName: "Doja",
          breed: "Siamese Cat",
          age: "1 year old"
        },
        {
          image: "../src/assets/doge.jpg",
          ownerName: "Atsuko Sato",
          petName: "Kabosu (Doge)",
          breed: "Shiba Inu",
          age: "18 years old"
        }
      ]
    }
  },
  mounted() {
    this.startAutoScroll()
  },
  beforeUnmount() {
    this.stopAutoScroll()
  },
  methods: {
    handleMouseMove(e) {
      // Get the pet container's position for proper eye tracking
      const petsContainer = this.$el.querySelector('.pets-container')
      if (!petsContainer) return
      
      const rect = petsContainer.getBoundingClientRect()
      const mouseX = e.clientX
      const mouseY = e.clientY
      
      // Calculate center of the pets container
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate angle from center to mouse
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX)
      
      // DOG EYES - positions scaled to viewBox coordinates
      this.dogLeftPupilX = 80 + Math.cos(angle) * 4
      this.dogLeftPupilY = 85 + Math.sin(angle) * 4
      this.dogRightPupilX = 120 + Math.cos(angle) * 4
      this.dogRightPupilY = 85 + Math.sin(angle) * 4
      
      // CAT EYES - positions scaled to viewBox coordinates
      this.catLeftPupilX = 80 + Math.cos(angle) * 5
      this.catLeftPupilY = 100 + Math.sin(angle) * 5
      this.catRightPupilX = 120 + Math.cos(angle) * 5
      this.catRightPupilY = 100 + Math.sin(angle) * 5
    },
    navigateToAuth() {
      this.$router.push({ name: 'login' });
    },
    navigateToMap() {
      this.$router.push({ name: 'map' });
    },
    nextScreenshot() {
      if (this.screenshotIndex < this.screenshots.length - 1) {
        this.screenshotIndex++
      }
    },
    previousScreenshot() {
      if (this.screenshotIndex > 0) {
        this.screenshotIndex--
      }
    },
    nextCommunity() {
      this.communityIndex = (this.communityIndex + 1) % this.PetList.length
    },
    previousCommunity() {
      this.communityIndex = (this.communityIndex - 1 + this.PetList.length) % this.PetList.length
    },
    goToCommunitySlide(index) {
      this.communityIndex = index
      // Reset the timer when manually clicking
      this.stopAutoScroll()
      this.startAutoScroll()
    },
    startAutoScroll() {
      this.autoScrollInterval = setInterval(() => {
        this.nextCommunity()
      }, 3000) // 3 seconds
    },
    stopAutoScroll() {
      if (this.autoScrollInterval) {
        clearInterval(this.autoScrollInterval)
        this.autoScrollInterval = null
      }
    },
    pauseAutoScroll() {
      this.stopAutoScroll()
    },
    resumeAutoScroll() {
      this.startAutoScroll()
    }
  }
}
</script>

<style scoped>
.landing-page {
  padding-top: 70px;
}

.pets-container {
  flex-wrap: wrap;
}

.pet-wrapper {
  max-width: 300px;
  cursor: pointer;
}

.interactive-pet {
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  width: 100%;
  height: auto;
}

.pet-wrapper:hover .interactive-pet {
  transform: scale(1.05);
}

.pupil {
  transition: cx 0.1s ease-out, cy 0.1s ease-out;
}

.gradient-text {
  background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-gradient {
  background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gradient.w-100 {
  display: block;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(20, 184, 166, 0.3);
  color: white;
}

.btn-gradient svg {
  display: inline-block;
  vertical-align: middle;
}

/* SECTION BACKGROUNDS - Transparent with clear distinction */
/* Important: Using higher specificity to override Bootstrap */
section.hero-section {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

section#features {
  background: rgba(240, 249, 255, 0.7) !important; /* Light blue with transparency */
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

section#how-it-works {
  background: rgba(255, 255, 255, 0.7) !important; /* White with transparency */
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

section.screenshots-section {
  background: rgba(250, 250, 250, 0.7) !important; /* Light gray with transparency */
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

section.community-section {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.85) 0%, rgba(37, 99, 235, 0.85) 100%) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
}

.hero-blur {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
  border-radius: 1.5rem;
  filter: blur(60px);
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
}

.feature-card {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feature-icon svg {
  width: 32px;
  height: 32px;
}

.step-number {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 0 auto;
}

/* CAROUSEL STYLES */
.carousel-container {
  position: relative;
  padding: 0 80px 60px 80px; /* Added bottom padding for indicators */
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  flex: 1;
  overflow: hidden;
  padding-bottom: 20px; /* Space for card shadow */
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel-btn-community {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.carousel-btn-community:hover:not(:disabled) {
  background: white;
  border-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.carousel-btn-community svg {
  stroke: #2563eb;
}

.carousel-btn-left {
  left: 10px;
}

.carousel-btn-right {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: -10px; /* Position below the content */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator-dot.active {
  background: rgba(0, 0, 0, 0.8);
  width: 32px;
  border-radius: 6px;
}

.indicator-dot-white {
  background: rgba(255, 255, 255, 0.5);
}

.indicator-dot-white.active {
  background: rgba(255, 255, 255, 1);
}

.screenshot-card {
  transition: all 0.3s ease;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.screenshot-card img {
  transition: transform 0.3s ease;
}

/* CAROUSEL TRANSITIONS */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.pixel-art-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.pixel-art-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.pixel-art-card img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center;
}

.pet-caption {
  color: white;
}

.pet-caption h5 {
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pet-caption p {
  font-size: 1rem;
  line-height: 1.6;
}

.pet-caption strong {
  font-weight: 600;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.navbar {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #14b8a6 !important;
}

/* RESPONSIVE ADJUSTMENTS */
@media (max-width: 768px) {
  .carousel-container {
    padding: 0 60px;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
  }
  
  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .pixel-art-card img {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .carousel-container {
    padding: 0 50px;
  }
  
  .carousel-btn {
    width: 35px;
    height: 35px;
  }
  
  .pixel-art-card img {
    height: 250px;
  }
}
</style>