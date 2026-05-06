export function Card(onCardClick?: (datum: any) => void, chart?: any) {
  return function (this: HTMLElement, d: any) {
    const card = this.querySelector(".card .card-inner");
    if (!card) return;

    card.outerHTML = getCardInner(d);

    // ✅ Attach to stable `this`, not the replaced element
    const self = this as any;
    if (self.__f3ClickHandler) {
      self.removeEventListener("click", self.__f3ClickHandler);
    }

    const handler = () => {
      // Re-center tree on clicked person
      if (chart) {
        chart.updateMainId(d.data.id);
        chart.updateTree({});
      }
      // Open side panel
      if (onCardClick) {
        onCardClick(d.data);
      }
    };

    self.__f3ClickHandler = handler;
    self.addEventListener("click", handler);
  };
}

function getCardInner(d: any) {
    const dd = d.data.data;
    const firstName = dd["firstName"] || dd["label"] || "";

    const lastName = dd["last name"] || "";
    const name = `${firstName} ${lastName}`.trim();
    const initials = name
        .split(" ")
        .map((n: string) => n[0] || "")
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const birthYear = dd.birthYear || dd.subText || "";
    const gender = dd.gender || "";
    const image = dd.avatar || dd.image || "";
    const isMain = d.data.main;

    const classList = getClassList(d).join(" ");

    const bg = gender === "F" || gender == "female" || gender == "Female"
        ? "rgb(209 130 140)"
        : "rgb(81, 125, 140)";

    const avatarHtml = image
        ? `<img
            src="${image}"
            style="
                width:56px;height:56px;border-radius:50%;
                object-fit:cover;
                
                flex-shrink:0;
                margin-top:10px;
                border:2px solid ${bg};
                color:${bg};
            "
            onerror="this.outerHTML='<div style=width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white;flex-shrink:0>${initials}</div>'"
            />`
        : `<div style="
            width:56px;
            height:56px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            border:2px solid ${bg};
            color:${bg};
          ">
            <span class="material-symbols-outlined" style="font-size:24px;">
              add
            </span>
          </div>`;

    const birthdayHtml = birthYear
        ? `<div style="font-size:10px;opacity:0.6;margin-top:2px;">${birthYear}</div>`
        : `<div style="font-size:10px;opacity:0.6;margin-top:2px;">-</div>`;

    if (d.data._new_rel_data) {
      // console.log('testing 1',d);
    
      const relLable = d.data._new_rel_data.label; // comes from library
      const relId = d.data._new_rel_data.rel_id;
      const rel_type = d.data._new_rel_data.rel_type;


      return `
        <div class="card-inner ${classList}" style="
          background:#fff;
          padding:12px;
          border-radius:14px;
          width:134px;
          min-height:130px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-family:sans-serif;
          text-align:center;
          cursor:pointer;
          box-shadow:0 4px 14px rgba(0,0,0,0.15);
          transition:all 0.2s ease;
        ">

          <div style="
            width:56px;
            height:56px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            border:2px solid ${bg};
            color:${bg};
          ">
            <span class="material-symbols-outlined" style="font-size:24px;">
              add
            </span>
          </div>

          <div style="
            font-size:13px;
            font-weight:600;
          ">
            ${relLable}
          </div>

        </div>
        `;
    }

    

 

    return `
        <div class="card-inner ${classList}" style="
        color:black;
        background:#fff;
        padding:10px 12px;
        border-radius:14px;
        width:134px;
        min-height:130px;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:2px;
        font-family:sans-serif;
        box-sizing:border-box;
        text-align:center;
        cursor:pointer;
        box-shadow:0 4px 14px rgba(0,0,0,0.25);
        transition:transform 0.2s,box-shadow 0.2s;
        ${isMain ? "outline:2px solid rgba(167,139,250,0.9);outline-offset:2px;" : ""}
        "
        onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.35)'"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)'"
        >
        ${avatarHtml}
        <div style="
            font-size:13px;font-weight:700;margin-top:6px;line-height:1.3;
            max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
            
        ">${name || "Unknown"}</div>
        ${birthdayHtml}
        </div>
    `;
}


function getClassList(d: any) {
    const list: string[] = [];
    const gender = d.data.data.gender;
    if (gender === "M") list.push("card-male");
    else if (gender === "F") list.push("card-female");
    else list.push("card-genderless");
    if (d.data.main) list.push("card-main");
    return list;
}

