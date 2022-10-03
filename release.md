# Added docker

**Docker** is a software platform that simplifies the process of _building_, _running_, _managing_ and _distributing applications_. It does this by virtualizing the operating system of the computer on which it is installed and running.

In a leighman's language, you can think of Docker as a way of enabling a developer to run an application _hassle free_.<br>
You can imagine, you have built your million dollar project and it has a lot of technologies used such as: **Sass**, **MySQL**, **Redis**, **Nodejs** and _many more_... You need to pitch your project and another developer has to run your project.<br>
The other developer has never done MySQL, Redis and blah blah that you have used in your project. So he has to start installing them and configuring them on his machine. He may get some configuration of softwares wrong and result in the common phrase **"It does not run on my machine"**.

Docker looks to solve this problem by allowing you to package your application all together with the set of technologies and their versions that you have used into one bundle commonly referred to as an **image**. _JUST_ give this bundle(_image_) to the other developer and he will run it with docker which will inturn get all the technologies used in the project together with their right configurations as they were in your machine.

To use Docker, you will need to Install Docker. Install [docker](https://docs.docker.com/compose/install/) and docker-compose on your computer.

If you are using Linux:

Run `sudo apt update`.<br>
To install _docker_, run `sudo apt install -y docker.io`.<br>
To install _docker-compose_, run `sudo apt install docker-compose`.<br>

Or you may opt for Docker Desktop. You can find it [here](https://docs.docker.com/desktop/install/linux-install/)

There is also docker desktop for other platforms(windows, Mac). Be sure to check [here](https://docs.docker.com/compose/install/) and find what you need.

<!-- [docker](https://docs.docker.com/compose/gettingstarted/) -->

This docker project uses [Nginx](https://www.nginx.com/)(<small><i>Pronounced as "Enging-X"</i></small>) to serve files. _Don't fret_, you can still open the project in your browser the way you usually do. But additionally, you can also run it with docker.

Open the project root in your terminal and run `docker-compose up`. Be connected to internet because if it does not find images used in the project in your computer, the it will go ahead and try to download from [Dockehub](https://hub.docker.com/_/nginx).

That's it. Open you browser at `http://localhost:5000` to see the application running. You only need Docker and no other installation(_you do not need to install nginx, docker will handle that for you_).

## Docker Image
This project as well has docker image hosted in [docker hub](https://hub.docker.com/repository/docker/smitterhane/taxman).

Pull it in your computer by running: `docker pull smitterhane/taxman:1.0.0`.

Run the pulled image as `docker run smitterhane/taxman:1.0.0`. Open your browser at `http://localhost:5000/` and allow your eyes to be pleased.

### ADDON

#### If you are using linux and the commandline, you may run into some issues like `permission denied`.

In this case, you need to run docker commands with `sudo`.

To use docker without `sudo`, be sure to add `docker` user to sudoers i.e `sudo usermod -aG sudo docker`. After running this, you may need to reboot your computer so things get fixed. If you use ubuntu or debian distro(kali), just type `reboot` command in the terminal.

Thank you. Happy coding 👍.<br>
https://lookupzach.netlify.app
