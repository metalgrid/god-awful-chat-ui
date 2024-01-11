<template>
  <!-- component -->

  <div class="h-screen p-5">
    <section class="shadow-xl rounded-md w-full lg:w-11/12 lg:mx-auto flex">
      <!-- Left section -->
      <div
        class="w-full lg:w-3/6 xl:w-2/6 flex flex-col justify-start items-stretch bg-white bg-opacity-80 rounded-md lg:rounded-none lg:rounded-l-md p-3"
      >
        <div class="flex-auto flex flex-col">
          <div class="flex-auto flex flex-row">
            <!-- [+] navigation -->
            <div class="p-1 flex flex-col justify-between items-center">
              <div class="">
                <div class="p-1 flex justify-center items-center text-gray-500 cursor-pointer">
                  <button
                    class="flex flex-col justify-center items-center w-full p-1 rounded-lg hover:bg-gray-50 hover:bg-opacity-30 focus:outline-none focus:ring"
                    aria-label="Hamburger menu"
                  >
                    <fa-icon class="h-5 w-5" :icon="['fas', 'bars']" />
                  </button>
                </div>
                <ul class="">
                  <nav-button icon="comments" :badge="2" active>All chats</nav-button>
                  <nav-button icon="comment-dots">Unread</nav-button>
                  <nav-button icon="address-card">Personal</nav-button>
                  <nav-button icon="sliders">Edit</nav-button>
                </ul>
              </div>
              <ul>
                <nav-button icon="gear">Settings</nav-button>
              </ul>
            </div>
            <!-- [-] navigation -->
            <!-- [+] user list -->
            <div class="w-full p-1">
              <search-box v-model="search"></search-box>
              <ul class="overflow-y-auto">
                <user-card
                  @click="openChat"
                  v-for="user in users"
                  :key="user.id"
                  :user="user"
                  :status-text="conversations[user.username]?.messages[0]?.message"
                  :active="
                    activeConvo !== null && conversations[user.username]?.id === activeConvo?.id
                  "
                ></user-card>
              </ul>
            </div>
            <!-- [-] user list -->
          </div>
        </div>
      </div>
      <!-- Middle section -->
      <div
        class="hidden w-3/6 bg-white h-full lg:flex flex-col justify-start items-stretch border-r-2 border-l-2 border-gray-100 lg:rounded-r-md xl:rounded-none"
      >
        <!-- Header with name -->
        <div
          class="flex flex-row items-center justify-between px-3 py-2 bg-gray-50 bg-opacity-40 border-b-2 border-gray-100"
        >
          <div class="">
            <h2 class="font-medium">Food porn group</h2>
            <p class="text-xs text-gray-500">4 memebres</p>
          </div>
          <div class="flex flex-row">
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Search"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path
                  d="M12.323,2.398c-0.741-0.312-1.523-0.472-2.319-0.472c-2.394,0-4.544,1.423-5.476,3.625C3.907,7.013,3.896,8.629,4.49,10.102c0.528,1.304,1.494,2.333,2.72,2.99L5.467,17.33c-0.113,0.273,0.018,0.59,0.292,0.703c0.068,0.027,0.137,0.041,0.206,0.041c0.211,0,0.412-0.127,0.498-0.334l1.74-4.23c0.583,0.186,1.18,0.309,1.795,0.309c2.394,0,4.544-1.424,5.478-3.629C16.755,7.173,15.342,3.68,12.323,2.398z M14.488,9.77c-0.769,1.807-2.529,2.975-4.49,2.975c-0.651,0-1.291-0.131-1.897-0.387c-0.002-0.004-0.002-0.004-0.002-0.004c-0.003,0-0.003,0-0.003,0s0,0,0,0c-1.195-0.508-2.121-1.452-2.607-2.656c-0.489-1.205-0.477-2.53,0.03-3.727c0.764-1.805,2.525-2.969,4.487-2.969c0.651,0,1.292,0.129,1.898,0.386C14.374,4.438,15.533,7.3,14.488,9.77z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 xl:text-blue-500 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Open"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <g>
                  <rect fill="none" height="24" width="24" />
                  <g>
                    <path
                      d="M2,4v16h20V4H2z M20,8.67h-2.5V6H20V8.67z M17.5,10.67H20v2.67h-2.5V10.67z M4,6h11.5v12H4V6z M17.5,18v-2.67H20V18H17.5z"
                    />
                  </g>
                </g>
              </svg>
            </button>
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="More"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path
                  fill-rule="nonzero"
                  d="M12,16 C13.1045695,16 14,16.8954305 14,18 C14,19.1045695 13.1045695,20 12,20 C10.8954305,20 10,19.1045695 10,18 C10,16.8954305 10.8954305,16 12,16 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M12,4 C13.1045695,4 14,4.8954305 14,6 C14,7.1045695 13.1045695,8 12,8 C10.8954305,8 10,7.1045695 10,6 C10,4.8954305 10.8954305,4 12,4 Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- Messages -->
        <div class="flex-auto flex flex-col justify-between overflow-y-auto">
          <div class="flex flex-col">
            <div class="flex flex-row p-2 w-11/12">
              <div class="w-1/12 py-2 flex">
                <img
                  src="https://www.statnews.com/wp-content/uploads/2018/01/AdobeStock_107381486-645x645.jpeg"
                  class="h-12 w-12 rounded-full self-end"
                  alt=""
                />
              </div>
              <div class="w-11/12 p-2">
                <div class="bg-gray-50 p-3 rounded-xl mb-2 relative">
                  <h2 class="text-sm font-semibold mb-2">Yaeko Lindblom</h2>
                  <p class="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                  <span class="text-xs text-gray-500 absolute right-2 bottom-2">09:24</span>
                </div>
                <div class="mb-2">
                  <img
                    class="rounded-xl w-1/2"
                    src="https://media-cdn.tripadvisor.com/media/photo-s/1b/78/81/ac/jabeerwocky-craft-beer.jpg"
                    alt=""
                  />
                </div>
                <div class="bg-gray-50 p-3 rounded-xl mt-2 relative">
                  <h2 class="font-semibold mb-2 text-sm">Yaeko Lindblom</h2>
                  <p class="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to make a type specimen
                    book.
                  </p>
                  <span class="text-xs text-gray-500 absolute right-2 bottom-2">10:44</span>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-end">
              <div class="p-1">
                <div
                  class="px-4 py-3 rounded-full my-2 bg-blue-500 text-white flex flex-row items-center"
                >
                  <p class="text-sm flex">There are many variations of passages of Lorem Ipsum</p>
                  <div class="ml-2 flex flex-row text-xs text-gray-300">
                    <span class="mr-1"> 10:46 </span>
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 19 14">
                      <path
                        fill-rule="nonzero"
                        d="M4.96833846,10.0490996 L11.5108251,2.571972 C11.7472185,2.30180819 12.1578642,2.27443181 12.428028,2.51082515 C12.6711754,2.72357915 12.717665,3.07747757 12.5522007,3.34307913 L12.4891749,3.428028 L5.48917485,11.428028 C5.2663359,11.6827011 4.89144111,11.7199091 4.62486888,11.5309823 L4.54038059,11.4596194 L1.54038059,8.45961941 C1.2865398,8.20577862 1.2865398,7.79422138 1.54038059,7.54038059 C1.7688373,7.31192388 2.12504434,7.28907821 2.37905111,7.47184358 L2.45961941,7.54038059 L4.96833846,10.0490996 L11.5108251,2.571972 L4.96833846,10.0490996 Z M9.96833846,10.0490996 L16.5108251,2.571972 C16.7472185,2.30180819 17.1578642,2.27443181 17.428028,2.51082515 C17.6711754,2.72357915 17.717665,3.07747757 17.5522007,3.34307913 L17.4891749,3.428028 L10.4891749,11.428028 C10.2663359,11.6827011 9.89144111,11.7199091 9.62486888,11.5309823 L9.54038059,11.4596194 L8.54038059,10.4596194 C8.2865398,10.2057786 8.2865398,9.79422138 8.54038059,9.54038059 C8.7688373,9.31192388 9.12504434,9.28907821 9.37905111,9.47184358 L9.45961941,9.54038059 L9.96833846,10.0490996 L16.5108251,2.571972 L9.96833846,10.0490996 Z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Input for writing a messages -->
        <div class="flex flex-row justify-between items-center p-3">
          <div class="">
            <button
              type="button"
              class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Upload a files"
            >
              <svg class="fill-current h-6 w-6" viewBox="0 0 20 20">
                <path
                  d="M4.317,16.411c-1.423-1.423-1.423-3.737,0-5.16l8.075-7.984c0.994-0.996,2.613-0.996,3.611,0.001C17,4.264,17,5.884,16.004,6.88l-8.075,7.984c-0.568,0.568-1.493,0.569-2.063-0.001c-0.569-0.569-0.569-1.495,0-2.064L9.93,8.828c0.145-0.141,0.376-0.139,0.517,0.005c0.141,0.144,0.139,0.375-0.006,0.516l-4.062,3.968c-0.282,0.282-0.282,0.745,0.003,1.03c0.285,0.284,0.747,0.284,1.032,0l8.074-7.985c0.711-0.71,0.711-1.868-0.002-2.579c-0.711-0.712-1.867-0.712-2.58,0l-8.074,7.984c-1.137,1.137-1.137,2.988,0.001,4.127c1.14,1.14,2.989,1.14,4.129,0l6.989-6.896c0.143-0.142,0.375-0.14,0.516,0.003c0.143,0.143,0.141,0.374-0.002,0.516l-6.988,6.895C8.054,17.836,5.743,17.836,4.317,16.411"
                ></path>
              </svg>
            </button>
          </div>
          <div class="flex-1 px-3">
            <input
              type="text"
              class="w-full border-2 border-gray-100 rounded-full px-4 py-1 outline-none text-gray-500 focus:outline-none focus:ring"
              placeholder="Write a message..."
            />
          </div>
          <div class="flex flex-row">
            <button
              type="button"
              class="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Show emojis"
            >
              <svg class="fill-current h-6 w-6" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
              aria-label="Record a voice"
            >
              <svg class="fill-current h-6 w-6" viewBox="0 0 20 20">
                <path
                  d="M10.403,15.231v2.035h2.827c0.223,0,0.403,0.181,0.403,0.404c0,0.223-0.181,0.403-0.403,0.403H6.77c-0.223,0-0.404-0.181-0.404-0.403c0-0.224,0.181-0.404,0.404-0.404h2.826v-2.035C6.89,15.024,4.751,12.758,4.751,10c0-0.223,0.181-0.403,0.404-0.403S5.559,9.777,5.559,10c0,2.449,1.992,4.441,4.441,4.441c2.449,0,4.441-1.992,4.441-4.441c0-0.223,0.182-0.403,0.404-0.403s0.403,0.18,0.403,0.403C15.248,12.758,13.108,15.024,10.403,15.231 M13.026,4.953V10c0,1.669-1.357,3.027-3.027,3.027S6.972,11.669,6.972,10V4.953c0-1.669,1.358-3.028,3.028-3.028S13.026,3.284,13.026,4.953M12.221,4.953c0-1.225-0.996-2.22-2.221-2.22s-2.221,0.995-2.221,2.22V10c0,1.225,0.996,2.22,2.221,2.22s2.221-0.995,2.221-2.22V4.953z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Right section -->
      <div class="hidden w-2/6 xl:block bg-white rounded-r-md p-5 overflow-y-auto">
        <header class="flex flex-row justify-end items-center">
          <button
            type="button"
            class="p-2 ml-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
          >
            <svg class="fill-current h-6 w-6" viewBox="0 0 20 20">
              <path
                d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
              ></path>
            </svg>
          </button>
        </header>
        <main>
          <div class="my-6">
            <ul class="flex flex-row justify-center items-center">
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <path
                      d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z"
                    />
                  </svg>
                  <p class="text-xs font-semibold">Add</p>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <path
                      fill-rule="nonzero"
                      d="M11,20 L13,20 C13.5522847,20 14,20.4477153 14,21 C14,21.5128358 13.6139598,21.9355072 13.1166211,21.9932723 L13,22 L11,22 C10.4477153,22 10,21.5522847 10,21 C10,20.4871642 10.3860402,20.0644928 10.8833789,20.0067277 L11,20 L13,20 L11,20 Z M3.30352462,2.28241931 C3.6693482,1.92735525 4.23692991,1.908094 4.62462533,2.21893936 L4.71758069,2.30352462 L21.2175807,19.3035246 C21.6022334,19.6998335 21.5927842,20.332928 21.1964754,20.7175807 C20.8306518,21.0726447 20.2630701,21.091906 19.8753747,20.7810606 L19.7824193,20.6964754 L18.127874,18.9919007 L18,18.9999993 L4,18.9999993 C3.23933773,18.9999993 2.77101468,18.1926118 3.11084891,17.5416503 L3.16794971,17.4452998 L5,14.6972244 L5,8.9999993 C5,7.98873702 5.21529462,7.00715088 5.62359521,6.10821117 L3.28241931,3.69647538 C2.89776658,3.3001665 2.90721575,2.66707204 3.30352462,2.28241931 Z M7.00817933,8.71121787 L7,9 L7,14.6972244 C7,15.0356672 6.91413188,15.3676193 6.75167088,15.6624466 L6.66410059,15.8066248 L5.86851709,17 L16.1953186,17 L7.16961011,7.7028948 C7.08210009,8.02986218 7.02771758,8.36725335 7.00817933,8.71121787 Z M12,2 C15.7854517,2 18.8690987,5.00478338 18.995941,8.75935025 L19,9 L19,12 C19,12.5522847 18.5522847,13 18,13 C17.4871642,13 17.0644928,12.6139598 17.0067277,12.1166211 L17,12 L17,9 C17,6.23857625 14.7614237,4 12,4 C11.3902636,4 10.7970241,4.10872043 10.239851,4.31831953 C9.72293204,4.51277572 9.14624852,4.25136798 8.95179232,3.734449 C8.75733613,3.21753002 9.01874387,2.6408465 9.53566285,2.4463903 C10.3171048,2.15242503 11.1488212,2 12,2 Z"
                    ></path>
                  </svg>
                  <p class="text-xs font-semibold">Mute</p>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex flex-col justify-center items-center p-2 m-2 w-16 h-16 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring"
                >
                  <svg class="fill-current h-6 w-6 mb-2" viewBox="0 0 24 24">
                    <g><path d="M0,0h24v24H0V0z" fill="none" /></g>
                    <g>
                      <path
                        d="M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z"
                      />
                    </g>
                  </svg>
                  <p class="text-xs font-semibold">Leave</p>
                </button>
              </li>
            </ul>
          </div>
          <div class="my-4">
            <ul>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.kormanmd.com/wp-content/uploads/sites/38/2019/02/botox-men-2-768x720.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Jose Waldow</h2>
                  <p class="text-xs text-blue-600 font-normal">Online</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.telegraph.co.uk/multimedia/archive/03249/archetypal-male-fa_3249635c.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Sherwood Rosol</h2>
                  <p class="text-xs text-blue-600 font-normal">Online</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2019/02/5-create-fake-people-in-2-seconds-on-this-insane-site.jpg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Leena Hannan</h2>
                  <p class="text-xs text-gray-400 font-normal">last seen 40 minutes ago</p>
                </div>
              </li>
              <li class="flex flex-row my-3">
                <div class="mr-4">
                  <img
                    src="https://www.statnews.com/wp-content/uploads/2018/01/AdobeStock_107381486-645x645.jpeg"
                    class="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="flex flex-col justify-center">
                  <h2 class="text-sm font-bold">Yaeko Lindblom</h2>
                  <p class="text-xs text-gray-400 font-normal">last seen 40 minutes ago</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="">
            <ul class="flex flex-row justify-between items-center bg-gray-50 rounded-lg p-1">
              <li class="bg-white px-3 py-1 text-xs font-semibold rounded-md cursor-pointer">
                Media
              </li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Links</li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Files</li>
              <li class="text-xs text-gray-500 font-semibold px-3 py-1 cursor-pointer">Voice</li>
            </ul>
            <ul class="grid grid-cols-3 gap-2 my-3">
              <li class="">
                <img
                  class="rounded-md"
                  src="https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/38/1474395998-ghk-0216-comfortfoodcover-meatballs.jpg?crop=0.856xw:0.571xh;0.0224xw,0.296xh&resize=640:*"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://media.self.com/photos/5f189b76c58e27c99fbef9e3/1:1/w_768,c_limit/blackberry-vanilla-french-toast.jpg"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1036880806.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*"
                  alt=""
                />
              </li>
              <li class="">
                <img
                  class="rounded-md"
                  src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700%2C636"
                  alt=""
                />
              </li>
            </ul>
          </div>
        </main>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import NavButton from '@/components/sidenav/NavButton.vue'
import SearchBox from '@/components/contacts/SearchBox.vue'
import UserCard from '@/components/contacts/UserCard.vue'
import { useAPI } from '@/composables/api'

import { inject, ref, unref } from 'vue'
import type { Auth, Conversation, User } from '@/types'
const search = ref('')
const users = ref<User[]>([])

const auth: Auth = unref(inject('auth', {} as Auth))

const { api } = useAPI('http://127.0.0.1:8080', auth.token)

api.getUsers().then((res) => {
  users.value = res
})

const conversations = ref<Record<string, Conversation>>({})
api.getDirectMessages().then((res) => {
  res.forEach((user) => {
    api.getConversation(user.username).then((convo) => {
      conversations.value[user.username] = convo
    })
  })
})

const activeConvo = ref<Conversation | null>(null)
const openChat = async (user: User) => {
  console.log('Opening chat with', user)

  const res = await api.getConversation(user.username)
  if (res?.exists) {
    conversations.value[user.username] = res
  } else {
    const convo = await api.createConversation(user.username)
    conversations.value[user.username] = convo
  }
  activeConvo.value = conversations.value[user.username]
}
</script>
<style>
section {
  height: 80vh;
}
</style>
