    <script>
    import { RouterLink, RouterView } from 'vue-router';
    </script>

    <template>
        <div >
            <nav class="navbar fixed-bottom bg-white headingFont" >
                <div class="container-fluid">
                    <ul class="navbar-nav w-100 d-flex justify-content-around flex-row text-center">
                        <li class="nav-item">
                            <img src="../assets/Sprite/HomeIcons/Paw.png" alt="">
                            <RouterLink class="nav-link active black" to="/pet">Pet</RouterLink>
                        </li>
                        <li class="nav-item">
                            <img src="../assets/Sprite/HomeIcons/Home.png" alt="">
                            <RouterLink class="nav-link active black" to="/home">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <img src="../assets/Sprite/HomeIcons/Social.png" alt="">
                            <RouterLink class="nav-link active primary" to="/social">Social</RouterLink>
                        </li>
                        <li class="nav-item">
                            <img src="../assets/Sprite/HomeIcons/Burger.png" alt="">
                            <RouterLink class="nav-link active primary" to="/meal">Meal</RouterLink>
                        </li>
                        <li class="nav-item">
                            <!-- INSERT IMAGE HERE -->
                             <h4>Img here</h4>
                            <RouterLink class="nav-link active primary" to="/profile">Profile</RouterLink>
                        </li>

                    </ul>
                </div>
            </nav>
                <nav class="navbar navbar-expand-sm bg-white headingFont">
                <div class="container-fluid" >
                    <a class="navbar-brand primary brandFont" href="/home">Peddit</a>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/">Home</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/about">About</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/login">Login</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/health">Health</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/profile">Profile</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/meal">Meal</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/pet">Pet</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/chatbot">Chatbot</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active text-light" to="/social">Social</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link active primary" to="/temp">Temp</RouterLink>
                            </li>                           
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </template>
