    <script>
    import { RouterLink, RouterView } from 'vue-router';
    </script>

    <template>
        <div>
            <nav class="navbar navbar-expand-lg bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand text-light" href="#">Peddit</a>
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
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </template>
