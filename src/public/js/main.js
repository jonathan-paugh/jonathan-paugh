cachedIcons = {};

$(() => {
    createSocialIcons();
    createTechnologyIcons();
    createProjectItems();
    createFooterTransition();
    updateFooterYear();
});

async function createProjectItems() {
    let data = await fetchFileAsync("./JonathanPaugh/src/public/data/projects.json");
    let template = await fetchFileAsync("./JonathanPaugh/src/template/project-item.xml");
    let technologies = await fetchFileAsync("./JonathanPaugh/src/public/data/technologies.json")
    projects = JSON.parse(data);
    technologies = JSON.parse(technologies)
    for (let [heading, project] of Object.entries(projects)) {
        if (project.hidden) { continue; }
        await createProjectItem(heading, project, template, technologies);
    }
}

async function createProjectItem(heading, project, template, technologies) {
    template = $(template).appendTo(".project-container");
    template.find(".project-item-link").attr("href", project.url);

    template.find(".project-item-heading").html(heading);
    template.find(".project-item-title").html(project.title);
    template.find(".project-item-type").html(`${project.type}, `);
    template.find(".project-item-year").html(project.year);

    if (project.badges) {
        project.badges.forEach(async badge => {
            let data = await fetchFileAsync(`./JonathanPaugh/src/public/svg/technologies/${technologies[badge][0]}`);
            icon = $(data).appendTo(template.find(".project-item-badges"));
            icon.addClass("no-hover");
        });
    }

    preview = createElement("img");
    preview.attr("src", project.preview);

    template.find(".project-item-preview").append(preview);

    if (project.buttons) {
        for (let [text, url] of project.buttons) {
            let link = createElement("a");
            link.attr("href", url);
            template.find(".project-item-footer").append(link);
            element = createElement("button")
            element.html(text);
            link.append(element);
        }
    }
}

async function createSocialIcons() {
    let data = await fetchFileAsync("./JonathanPaugh/src/public/data/socials.json");
    socials = JSON.parse(data);
    for (let [file, url] of Object.values(socials)) {
        await createSocialIcon(file, url);
    }
}

async function createSocialIcon(file, url) {
    let data = await fetchFileAsync(`./JonathanPaugh/src/public/svg/socials/${file}`);
    let link = createElement("a");
    link.attr("href", url);
    $(".splash-icons").append(link);
    link.append(data);
}

async function createTechnologyIcons() {
    let data = await fetchFileAsync("./JonathanPaugh/src/public/data/technologies.json");
    technologies = JSON.parse(data);
    for (let [name, files] of Object.entries(technologies)) {
        await createTechnologyIcon(name, files[1]);
    }
}

async function createTechnologyIcon(name, file) {
    let data = await fetchFileAsync(`./JonathanPaugh/src/public/svg/technologies/${file}`);

    let container = createDiv();
    $(".about-technologies-container").append(container);

    let link = createElement("a");
    container.append(link);
    link.append(data);

    let tooltip = createDiv();
    tooltip.addClass("tooltip");
    tooltip.html(name);
    link.before(tooltip);

    Popper.createPopper(link[0], tooltip[0], {
        placement: "bottom"
    });

    link.hover(() => {
        tooltip.addClass("active");
    }, () => {
        tooltip.removeClass("active");
    });
}

function createFooterTransition() {
    fetchFile("./JonathanPaugh/src/public/svg/transition.svg", (data) => {
        $(".transition").append(data);
    });
}

function updateFooterYear() {
    $(".footer-year").append(new Date().getFullYear());
}
