//link to HTML page that is fetched from
const htmlUrl = "https://static-links-page.signalnerve.workers.dev"

//Array of links to render
const linkArray = [
  {
    "name": "My Personal Website",
    "url" : "https://gmihir.github.io"
  },
  {
    "name": "My GitHub Page",
    "url" : "https://github.com/gmihir"
  },
  {
    "name": "MyLinkedIn Page",
    "url" : "https://www.linkedin.com/in/mihir-gupta-50b299168/"
  },
  {
    "name": "My Side Project -- College Shark",
    "url" : "http://www.college-shark.com"
  }
];

// event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Handles the incoming request and decides to either display 
 * static HTML page or API output depending on path
 * 
 * @param request 
 * The request that is made to the worker.
 */
async function handleRequest(request) {
  let pathname = new URL(request.url).pathname

  //if the route is links, want to show links JSON array above
  if(pathname === "/links") {
    return new Response(JSON.stringify(linkArray), {
     headers: {'content-type': 'application/json;charset=UTF-8' },
    })
  }
  else {
    // need correct content-type for returning HTML from worker
    const htmlHeader = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(htmlUrl, htmlHeader)

    // instantiate HTML Rewriter on all elements (*) 
    // instantiate custom LinksTransformer class with existing link array
    // transform response from static HTML with LinksTransformer class
    let html = new HTMLRewriter().on("*", new LinksTransformer(linkArray)).transform(response);
    
    //return final HTML after HTMLRewriter has transformed it
    return(html);
  }
}

/**
 * Class that uses HTMLRewriter to modify web page as required 
 * Takes in links object in constructor to display in HTML
 */
class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  /**
   * Handler method to modify HTML file 
   * @param {*} element HTML element that can be modified with HTMLRewriter
   */
  async element(element) {
    // add all links as <a href> tags, styled with existing links CSS
    if(element.tagName === "div" && element.getAttribute("id") === "links") {
      this.links.forEach(function(link) {
        element.append(`<a href="${link.url}">${link.name}</a>`,{html: true});
      });
    }
    // remove inline styling (contains display:none) to show profile div
    else if(element.tagName === "div" && element.getAttribute("id") === "profile") {
      element.removeAttribute("style");
    }
    // add profile image to web page in avatar div
    else if(element.tagName === "img" && element.getAttribute("id") === "avatar") {
      element.setAttribute("src","https://gmihir.github.io//assets/img/0.jpeg");
      element.setAttribute("alt","Hi!");
    }
    //set header to name
    else if(element.tagName === "h1" && element.getAttribute("id") === "name") {
      element.setInnerContent("Mihir Gupta")
    }
    //add social links with svg icons
    else if(element.tagName === "div" && element.getAttribute("id") === "social") {
      element.removeAttribute("style");
      element.append(`<a href="https://instagram.com/mihirgpta">
      <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" />
      </a>
      <a href="https://github.com/gmihir">
      <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg" />
      </a>
      </a>
      <a href="https://twitter.com/itsthegup">
      <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" />
      </a>`,{html:true} )
    }
    // change page title to name
    else if(element.tagName === "title") {
      element.setInnerContent("Mihir Gupta");
    }
    // change styling to bg-blue-400 from Tailwind CSS color palette
    else if(element.tagName === "body") {
      element.setAttribute("class","bg-blue-400")
    }
  }
}

