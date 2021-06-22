const app=document.querySelector("#app")

app.text


function xhr_request(callback_fun=[],args=[]){
    app.classList.remove("country_info")
    app.classList.add("country_list")
    window.scroll(0,0)

    const xhr=new XMLHttpRequest()
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let countres = xhr.responseXML.querySelectorAll("country")
            select_region_li(countres)
            for(callback of callback_fun){
                countres=callback(countres,args)
            }

            display_data(countres)

        }
    }

    xhr.open("GET", "./data/data.xml")
    xhr.send()
}


function display_data(countres){
    app.innerHTML=""

    if(app.getAttribute("class")=="country_list"){
          
        for (let coutry of countres){
            coutry_name=coutry.querySelector("name").textContent
            coutry_region=coutry.querySelector("region").textContent
            coutry_capital=coutry.querySelector("capital").textContent
            coutry_description=coutry.querySelector("description").textContent
            coutry_imgs=coutry.querySelector("img").textContent
            coutry_imgs_split=coutry_imgs.split(",")

            app.innerHTML+=`
            <section class="country">
                    <div class="coun_img">
                        <img src="${coutry_imgs_split[0]}" alt="">
                    </div>
                    <div class="coun_info">
                        <h2>${coutry_name}</h2>
                    <p>Region:<a href="#region/${coutry_region}">${coutry_region}</a></p>
                    <p>Capital:${coutry_capital}</p>
                    <a href="#coutry/${coutry_name}">Read more</a>
                    </div>
                </section>
            `
        }
    }else if(app.getAttribute("class")=="country_info"){
        coutry_name=countres[0].querySelector("name").textContent
        coutry_description=countres[0].querySelector("description").textContent
        coutry_imgs=countres[0].querySelector("img").textContent
        coutry_imgs_split=coutry_imgs.split(",")
        let app_html = `
                    <div class="coutry_info_img">
                    <div class="glide" id="glide">
                    <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                    `
        for(let img of coutry_imgs_split){

            app_html+=`             
                    <li class="glide__slide">
                        <div class="country_slide_img">
                            <img src=".${img}" alt="">
                        </div>
                    </li>
                    `    
        }

        app_html+= `             
                </ul>
                </div>
                </div>
                <h1>${coutry_name}</h1>
                <p> ${coutry_description}</p>
                </div>

                `
        app.innerHTML=app_html

        const slider=document.getElementById("glide")
        if(slider){
            new Glide(slider,{
                "type": 'carousel',
                "startAt": 0,
                "autoplay":3000,
                "hoverpause":false,
                "perView":1,
                "animationDuration":2000,
                "animationTimingFunc":"linear"

            }).mount()
        }
    }
    
}

function filter_by_region(coutres,args){
    let filter_coutres=[]
    show_filter_pill(args['region'])
    
    for(let coutry of coutres){
        const region=coutry.querySelector("region").textContent
        if(region==args['region']){
            filter_coutres.push(coutry)
        }
    }
    return filter_coutres

}
function display_coutry_info(coutres,args){
    let filter_coutres=[]
    show_filter_pill(args['name'])
    for(let coutry of coutres){
        const name=coutry.querySelector("name").textContent
        if(name==args['name']){
            filter_coutres.push(coutry)
            
        }
    }
    app.classList.remove("country_list")
    app.classList.add("country_info")
   
    return filter_coutres

}
function show_filter_pill(filter_name){
    const filter_div=document.querySelector("#filter")
    filter_div.innerHTML=`<div class="filter_pill">
                                ${filter_name}
                                <button id="close_pill">x</button>

                            </div>
                            `
}
function select_region_li(coutres){
    
    const region_list_ul=document.querySelector(".region_list")
    region_list_ul.innerHTML=""
    let list_of_region=[]
    for (let coutry of coutres){
        coutry_region=coutry.querySelector("region").textContent
        if(!list_of_region.includes(coutry_region)){
            list_of_region.push(coutry_region)
            region_list_ul.innerHTML+=`<li><a href="#region/${coutry_region}" class="region_li">${coutry_region}</a></li>`
        }
    }
}




window.onload=(e)=>{
    xhr_request()
}
document.body.onclick=(e)=>{
    if(e.target.tagName=="A"&&e.target.getAttribute("href").indexOf("#region")>-1){
        let url=e.target.getAttribute("href")
        let split_url=url.split("/")
        xhr_request([filter_by_region],{'region':split_url[1]})

    }
    if(e.target.tagName=="A"&&e.target.getAttribute("href").indexOf("#coutry")>-1){
        let url=e.target.getAttribute("href")
        let split_url=url.split("/")
        xhr_request([display_coutry_info],{'name':split_url[1]})
        

    }
    if(e.target.id=="close_pill"||e.target.getAttribute("href")=="#home"){
        const filter_div=document.querySelector("#filter")
        filter_div.innerHTML=""
        xhr_request()  
    }
    if(e.target.id=="select_region"||e.target.getAttribute("class")=="region_li"){

        document.querySelector(".nav").classList.toggle("show_region_list");
    }
    
}


