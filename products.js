function scrapeProducts(elementId) {
    var result = {}
    var el = document.getElementById(elementId);
    var categEls = el.getElementsByTagName('category');
    for (var i = 0; i < categEls.length; i++) {
        var categEl = categEls[i];
        var categName = categEl.getAttribute('name');
        result[categName] = {}
        var groupEls = categEl.getElementsByTagName('group');
        for (var j = 0; j < groupEls.length; j++) {
            var groupEl = groupEls[j];
            var groupName = groupEl.getAttribute('name');
            result[categName][groupName] = []
            var itemEls = groupEl.getElementsByTagName('item');
            for (var k = 0; k < itemEls.length; k++) {
                var itemEl = itemEls[k];
                var itemName = itemEl.getAttribute('name');
                var itemImage = itemEl.getAttribute('image');
                var itemDescription = itemEl.getAttribute('description');
                var itemExtendedHTML = itemEl.innerHTML;
                var item = {
                    name: itemName,
                    image: itemImage,
                    description: itemDescription,
                    extend: itemExtendedHTML
                }
                result[categName][groupName].push(item)
            }
        }
    }
    return result
}

const categories = scrapeProducts('products')

const prodEl = document.getElementById('products');
prodEl.innerHTML = '';

const modalContainerEl = document.createElement('div')

for (category in categories) {
    // category element 
    var catEl = document.createElement('div')
    catEl.classList.add('category','pb-5')

    // category header 
    var catH1 = document.createElement('h1')
    catH1.innerHTML = category
    catEl.append(catH1)

    // group
    for (group in categories[category]) {
        // group element
        var groupEl = document.createElement('div')
        groupEl.classList.add('group','pt-5','my-5')

        // group header
        var groupH3 = document.createElement('h3')
        groupH3.innerHTML = group
        groupEl.append(groupH3)

        // group items
        var groupItems = document.createElement('div')
        groupItems.classList.add('js-flickity')
        var flickityAttr = document.createAttribute('data-flickity-options')
        flickityAttr.value = '{ "freeScroll": true, "wrapAround": true }'
        groupItems.setAttribute('data-flickity-options', '{ "freeScroll": true, "wrapAround": true }')
        if (Array.isArray(categories[category][group])) {
            var ctr = 0;
            // for each item in group list
            categories[category][group].forEach(item => {
                ctr++;
                // item id
                var itemID = `${category.toLowerCase().replace(/\s/, "_")}-${group.toLowerCase().replace(/\s/, "_")}-${ctr}`

                // clickable image for modal
                var itemModalEl = document.createElement('div')
                itemModalEl.setAttribute('data-toggle', 'modal')
                itemModalEl.setAttribute('data-target', `#${itemID}`)
                itemModalEl.setAttribute('style', 'margin:0 1.5em;min-width:300px;width:fill-content;')
                itemModalEl.innerHTML = `<img src="${item.image}">`
                groupItems.append(itemModalEl)

                // modal for current item
                var modelEl = `
                    <div class="modal fade" id="${itemID}" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title text-center" style="flex:1">${item.name}</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body text-center">
                                    ${item.description}
                                    <div class="text-center">${item.extend}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                modalContainerEl.innerHTML += modelEl
            });
        }
        groupEl.append(groupItems)
        catEl.append(groupEl)
    }
    prodEl.append(catEl)
}
document.body.append(modalContainerEl)