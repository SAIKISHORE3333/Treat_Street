
        const sopApp = {
            recipes: [],
            currentRecipeId: null,
            
            // Initialization
            catalog: [],
            
            updateCatalogWithSubRecipes() {
                // Remove existing sub-recipes from catalog to prevent duplicates
                if (!Array.isArray(this.catalog)) this.catalog = [];
                this.catalog = this.catalog.filter(item => item.category !== 'Sub-Recipe');
                
                let maxId = this.catalog.reduce((max, item) => (typeof item.id === 'number' && item.id > max) ? item.id : max, 0);

                if (this.recipes && Array.isArray(this.recipes)) {
                    for (const recipe of this.recipes) {\n                        if (!recipe) continue;
                        let totalCost = 0;
                        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                            for (const ing of recipe.ingredients) {
                                if (ing.notes) {
                                    const match = ing.notes.match(/Cost: £([\d.]+)/);
                                    if (match) {
                                        totalCost += parseFloat(match[1]);
                                    }
                                }
                            }
                        }
                        
                        if (totalCost > 0 || (recipe.title && recipe.yield)) {
                            maxId++;
                            this.catalog.push({
                                id: maxId,
                                name: recipe.title || 'Untitled Recipe',
                                category: 'Sub-Recipe',
                                size: recipe.yield || 'Unit',
                                supplier: 'Internal',
                                price: parseFloat(totalCost.toFixed(2)),
                                vatRate: 0
                            });
                        }
                    }
                }
                
                // Rebuild Datalist
                let datalist = document.getElementById('ingredient-catalog-list');
                if (datalist && this.catalog) {
                    datalist.innerHTML = this.catalog.map(i => `<option value="${i.name.replace(/"/g, '&quot;')}">`).join('');
                }
            },

            init() {
                // Load Catalog
                const localCatalog = localStorage.getItem('ts_shared_catalog');
                this.catalog = localCatalog ? JSON.parse(localCatalog) : (window.tsCatalog ? window.tsCatalog : []);
                if (!Array.isArray(this.catalog)) this.catalog = window.tsCatalog ? window.tsCatalog : [];
                
                // Build Datalist
                let datalist = document.getElementById('ingredient-catalog-list');
                if (!datalist) {
                    datalist = document.createElement('datalist');
                    datalist.id = 'ingredient-catalog-list';
                    document.body.appendChild(datalist);
                }
                datalist.innerHTML = this.catalog.map(i => `<option value="${i.name.replace(/"/g, '&quot;')}">`).join('');

                this.loadData();
                this.updateCatalogWithSubRecipes();
                                this.showDashboard();
                this.renderDashboard();
                
                // Set print date
                document.getElementById('printDate').innerText = new Date().toLocaleDateString();
            },

            // Data Management
            calculateRowCost(element) {
                const row = element.closest('tr');
                const nameInput = row.querySelector('.ing-name').value;
                const qtyInput = parseFloat(row.querySelector('.ing-qty').value);
                const unitInput = row.querySelector('.ing-unit').value;
                const notesInput = row.querySelector('.ing-notes');

                if (!nameInput || !this.catalog) return;
                
                const item = this.catalog.find(i => i.name === nameInput);
                if (!item) return;

                const price = parseFloat(item.price) || 0;
                const sizeStr = (item.size || '').toLowerCase();
                
                let totalCatalogAmt = 1;
                let isVolume = false;
                let isWeight = false;

                const match = sizeStr.match(/(\d+)\s*x\s*([\d.]+)\s*([a-z]+)/);
                if (match) {
                    const count = parseFloat(match[1]);
                    const amount = parseFloat(match[2]);
                    const type = match[3];
                    totalCatalogAmt = count * amount;
                    if (type.includes('ltr') || type === 'l') { totalCatalogAmt *= 1000; isVolume = true; }
                    else if (type.includes('ml')) { isVolume = true; }
                    else if (type.includes('kg')) { totalCatalogAmt *= 1000; isWeight = true; }
                    else if (type.includes('g')) { isWeight = true; }
                } else {
                    const singleMatch = sizeStr.match(/([\d.]+)\s*([a-z]+)/);
                    if (singleMatch) {
                        const amount = parseFloat(singleMatch[1]);
                        const type = singleMatch[2];
                        totalCatalogAmt = amount;
                        if (type.includes('ltr') || type === 'l') { totalCatalogAmt *= 1000; isVolume = true; }
                        else if (type.includes('ml')) { isVolume = true; }
                        else if (type.includes('kg')) { totalCatalogAmt *= 1000; isWeight = true; }
                        else if (type.includes('g')) { isWeight = true; }
                    }
                }

                if (isNaN(qtyInput) || !unitInput || qtyInput === 0) {
                    notesInput.value = `£${price.toFixed(2)} / ${item.size || 'Unit'}`;
                    return;
                }

                let recipeBaseQty = qtyInput;
                const u = unitInput.toLowerCase();
                
                if (u === 'l') recipeBaseQty = qtyInput * 1000;
                else if (u === 'tbsp') recipeBaseQty = qtyInput * 15;
                else if (u === 'tsp') recipeBaseQty = qtyInput * 5;
                else if (u === 'cups') recipeBaseQty = qtyInput * 250;
                else if (u === 'kg') recipeBaseQty = qtyInput * 1000;
                else if (u === 'oz') recipeBaseQty = qtyInput * 28.35;
                else if (u === 'lbs') recipeBaseQty = qtyInput * 453.59;
                
                let calculatedCost = 0;
                if (totalCatalogAmt > 0) {
                    calculatedCost = (price / totalCatalogAmt) * recipeBaseQty;
                }
                
                notesInput.value = `Cost: £${calculatedCost.toFixed(2)} (from £${price.toFixed(2)} / ${item.size || 'Unit'})`;
            },

            handleIngredientSelect(input) {
                const val = input.value;
                const item = this.catalog.find(i => i.name === val);
                if (item) {
                    const row = input.closest('tr');
                    const notesInput = row.querySelector('.ing-notes');
                    const unitInput = row.querySelector('.ing-unit');
                    
                    // Try to infer unit based on size
                    let inferredUnit = 'unit';
                    const sizeStr = (item.size || '').toLowerCase();
                    if (sizeStr.includes('g') || sizeStr.includes('kg')) inferredUnit = 'g';
                    if (sizeStr.includes('ml') || sizeStr.includes('ltr') || sizeStr.includes('l')) inferredUnit = 'ml';
                    
                    if (!unitInput.value || unitInput.value === 'unit' || unitInput.value === '') {
                        const exists = Array.from(unitInput.options).some(o => o.value === inferredUnit);
                        if (exists) unitInput.value = inferredUnit;
                    }

                    this.calculateRowCost(input);
                }
            },
            
            loadData() {
                const data = localStorage.getItem('recipeSOPs');
                if (data) {
                    this.recipes = JSON.parse(data);
                } else {
                    // Seed some dummy data for demonstration
                    this.recipes = [
                        {
                            id: this.generateId(),
                            title: 'Classic Marinara Sauce',
                            category: 'Sauces',
                            station: 'Prep',
                            prepTime: '15 mins',
                            cookTime: '45 mins',
                            yield: '4 Liters',
                            shelfLife: '5 days',
                            costing: 'Target Cost: 18%\\nEnsure tomatoes are fully crushed.',
                            ingredients: [
                                { name: 'San Marzano Tomatoes', qty: '3', unit: 'kg', notes: 'Canned, crushed' },
                                { name: 'Extra Virgin Olive Oil', qty: '120', unit: 'ml', notes: '' },
                                { name: 'Garlic', qty: '50', unit: 'g', notes: 'Minced fine' },
                                { name: 'Fresh Basil', qty: '1', unit: 'bunch', notes: 'Torn' }
                            ],
                            equipment: ['Large heavy-bottom pot', 'Immersion blender', 'Storage containers (4L)'],
                            steps: [
                                { desc: 'Heat olive oil in the pot over medium heat.', timeTemp: 'Medium Heat', isCritical: false },
                                { desc: 'Add minced garlic and sauté until fragrant but NOT brown.', timeTemp: '1-2 mins', isCritical: true },
                                { desc: 'Add crushed tomatoes. Stir well and bring to a gentle simmer.', timeTemp: 'Simmer', isCritical: false },
                                { desc: 'Reduce heat to low, partially cover, and let simmer to develop flavor. Stir occasionally to prevent burning on the bottom.', timeTemp: '45 mins', isCritical: true },
                                { desc: 'Remove from heat. Stir in fresh torn basil leaves.', timeTemp: '', isCritical: false },
                                { desc: 'Cool in ice bath before storing in walk-in cooler.', timeTemp: '< 4°C within 2hrs', isCritical: true }
                            ],
                            updatedAt: new Date().toISOString()
                        }
                    ];
                    this.saveData();
                    this.updateCatalogWithSubRecipes();
                                                        }
            },

            saveData() {
                localStorage.setItem('recipeSOPs', JSON.stringify(this.recipes));
            },

            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            },

            // Navigation
            hideAllViews() {
                document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
                window.scrollTo(0, 0);
            },

            showDashboard() {
                this.hideAllViews();
                document.getElementById('dashboardView').classList.remove('hidden');
                this.renderDashboard();
            },

            showForm(recipeId = null) {
                this.hideAllViews();
                document.getElementById('formView').classList.remove('hidden');
                this.currentRecipeId = recipeId;
                
                if (recipeId) {
                    document.getElementById('formTitle').innerText = 'Edit Recipe SOP';
                    this.populateForm(recipeId);
                } else {
                    document.getElementById('formTitle').innerText = 'Create Recipe SOP';
                    this.resetForm();
                }
            },

            showSOP(recipeId) {
                this.hideAllViews();
                document.getElementById('sopView').classList.remove('hidden');
                this.currentRecipeId = recipeId;
                this.renderSOPView(recipeId);
            },

            // Dashboard Logic
            renderDashboard() {
                const grid = document.getElementById('recipeGrid');
                const emptyState = document.getElementById('emptyState');
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                const categoryFilter = document.getElementById('categoryFilter').value;

                let filtered = this.recipes.filter(r => {
                    const matchesSearch = r.title.toLowerCase().includes(searchTerm) || r.station.toLowerCase().includes(searchTerm);
                    const matchesCategory = categoryFilter === '' || r.category === categoryFilter;
                    return matchesSearch && matchesCategory;
                });

                grid.innerHTML = '';

                if (filtered.length === 0) {
                    grid.classList.add('hidden');
                    emptyState.classList.remove('hidden');
                    emptyState.classList.add('flex');
                } else {
                    grid.classList.remove('hidden');
                    emptyState.classList.add('hidden');
                    emptyState.classList.remove('flex');

                    filtered.forEach(recipe => {
                        const card = document.createElement('div');
                        card.className = 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full';
                        card.onclick = () => this.showSOP(recipe.id);
                        
                        let badgeColor = 'bg-slate-100 text-slate-700';
                        if (recipe.category === 'Mains') badgeColor = 'bg-indigo-100 text-indigo-700';
                        if (recipe.category === 'Prep') badgeColor = 'bg-amber-100 text-amber-700';
                        if (recipe.category === 'Sauces') badgeColor = 'bg-rose-100 text-rose-700';
                        
                        card.innerHTML = `
                            <div class="p-5 flex-grow">
                                <div class="flex justify-between items-start mb-3">
                                    <span class="px-2.5 py-1 ${badgeColor} text-xs font-bold uppercase tracking-wider rounded-md">${recipe.category}</span>
                                    <button onclick="event.stopPropagation(); sopApp.deleteRecipe('${recipe.id}')" class="text-slate-300 hover:text-danger transition-colors p-1" title="Delete">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                <h3 class="text-xl font-bold text-slate-900 mb-1 leading-tight">${recipe.title}</h3>
                                <p class="text-sm font-medium text-primary mb-4"><i class="fas fa-map-marker-alt mr-1"></i> ${recipe.station}</p>
                                
                                <div class="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                    <div class="flex items-center"><i class="far fa-clock w-5 text-slate-400"></i> ${recipe.prepTime || '-'}</div>
                                    <div class="flex items-center"><i class="fas fa-fire w-5 text-slate-400"></i> ${recipe.cookTime || '-'}</div>
                                </div>
                            </div>
                            <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 text-sm font-medium text-slate-500 flex justify-between items-center">
                                <span>View SOP</span>
                                <i class="fas fa-chevron-right text-xs"></i>
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                }
            },

            filterRecipes() {
                this.renderDashboard();
            },

            deleteRecipe(id) {
                if (confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
                    this.recipes = this.recipes.filter(r => r.id !== id);
                    this.saveData();
                    this.updateCatalogWithSubRecipes();
                                                            this.renderDashboard();
                }
            },

            // Form Logic
            resetForm() {
                document.getElementById('recipeForm').reset();
                document.getElementById('ingredientsBody').innerHTML = '';
                document.getElementById('equipmentList').innerHTML = '';
                document.getElementById('stepsContainer').innerHTML = '';
                
                // Add initial empty rows
                this.addIngredientRow();
                this.addEquipmentRow();
                this.addStepRow();
            },

            populateForm(recipeId) {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (!recipe) return;

                document.getElementById('recipeTitle').value = recipe.title;
                document.getElementById('recipeCategory').value = recipe.category;
                document.getElementById('recipeStation').value = recipe.station;
                document.getElementById('recipePrepTime').value = recipe.prepTime;
                document.getElementById('recipeCookTime').value = recipe.cookTime;
                if (document.getElementById('recipeYieldNum')) {
                    const y = recipe.yield || '';
                    const parts = y.split(' ');
                    if (parts.length > 1 && !isNaN(parts[0])) {
                        document.getElementById('recipeYieldNum').value = parts[0];
                        document.getElementById('recipeYieldUnit').value = parts.slice(1).join(' ');
                    } else {
                        document.getElementById('recipeYieldNum').value = y;
                    }
                } else {
                    document.getElementById('recipeYield').value = recipe.yield || '';
                }
                document.getElementById('recipeShelfLife').value = recipe.shelfLife;
                document.getElementById('recipeCosting').value = recipe.costing;

                // Ingredients
                const ingBody = document.getElementById('ingredientsBody');
                ingBody.innerHTML = '';
                recipe.ingredients.forEach(ing => this.addIngredientRow(ing));
                if(recipe.ingredients.length === 0) this.addIngredientRow();

                // Equipment
                const eqList = document.getElementById('equipmentList');
                eqList.innerHTML = '';
                recipe.equipment.forEach(eq => this.addEquipmentRow(eq));
                if(recipe.equipment.length === 0) this.addEquipmentRow();

                // Steps
                const stepCont = document.getElementById('stepsContainer');
                stepCont.innerHTML = '';
                recipe.steps.forEach(step => this.addStepRow(step));
                if(recipe.steps.length === 0) this.addStepRow();
            },

            addIngredientRow(data = { name: '', qty: '', unit: '', notes: '' }) {
                const tbody = document.getElementById('ingredientsBody');
                const tr = document.createElement('tr');
                tr.className = 'ing-row hover:bg-slate-50 transition-colors group';
                tr.innerHTML = `
                    <td class="py-2 pr-2">
                        <input type="text" value="${data.name.replace(/"/g, '&quot;')}" placeholder="Search catalog or type custom..." list="ingredient-catalog-list" oninput="sopApp.handleIngredientSelect(this)" class="ing-name w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none">
                    </td>
                    <td class="py-2 pr-2">
                        <input type="text" value="${data.qty}" placeholder="0" class="ing-qty w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none" oninput="sopApp.calculateRowCost(this)">
                    </td>
                    <td class="py-2 pr-2">
                        <select class="ing-unit onchange="sopApp.calculateRowCost(this)" w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none">
                            <option value="" ${!data.unit ? 'selected' : ''}>Select Unit</option>
                            <option value="unit" ${data.unit === 'unit' ? 'selected' : ''}>Units</option>
                            <option value="tbsp" ${data.unit === 'tbsp' ? 'selected' : ''}>Tbsp</option>
                            <option value="tsp" ${data.unit === 'tsp' ? 'selected' : ''}>Tsp</option>
                            <option value="ml" ${data.unit === 'ml' ? 'selected' : ''}>ml</option>
                            <option value="L" ${data.unit === 'L' ? 'selected' : ''}>L</option>
                            <option value="g" ${data.unit === 'g' ? 'selected' : ''}>g</option>
                            <option value="kg" ${data.unit === 'kg' ? 'selected' : ''}>kg</option>
                            <option value="oz" ${data.unit === 'oz' ? 'selected' : ''}>oz</option>
                            <option value="lbs" ${data.unit === 'lbs' ? 'selected' : ''}>lbs</option>
                            <option value="cups" ${data.unit === 'cups' ? 'selected' : ''}>Cups</option>
                        </select>
                    </td>
                    <td class="py-2 pr-2">
                        <input type="text" value="${data.notes.replace(/"/g, '&quot;')}" placeholder="Notes..." class="ing-notes w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none">
                    </td>
                    <td class="py-2 text-center">
                        <button type="button" onclick="this.closest('tr').remove()" class="text-slate-300 hover:text-danger p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            },

            addEquipmentRow(val = '') {
                const ul = document.getElementById('equipmentList');
                const li = document.createElement('li');
                li.className = 'eq-row flex items-center gap-2 group';
                li.innerHTML = `
                    <i class="fas fa-grip-vertical text-slate-300 cursor-move hidden sm:block"></i>
                    <input type="text" value="${val.replace(/"/g, '&quot;')}" placeholder="Equipment item (e.g., 20L Stock pot)" class="eq-val flex-grow px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none">
                    <button type="button" onclick="this.closest('li').remove()" class="text-slate-300 hover:text-danger p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                ul.appendChild(li);
            },

            addStepRow(data = { desc: '', timeTemp: '', isCritical: false }) {
                const cont = document.getElementById('stepsContainer');
                const stepCount = cont.children.length + 1;
                const div = document.createElement('div');
                div.className = 'step-row bg-slate-50 border border-slate-200 rounded-lg p-4 relative group';
                div.innerHTML = `
                    <div class="absolute -left-3 -top-3 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm step-num">
                        ${stepCount}
                    </div>
                    <div class="absolute right-2 top-2">
                        <button type="button" onclick="sopApp.removeStep(this)" class="text-slate-300 hover:text-danger p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                        <div class="md:col-span-8">
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Instruction</label>
                            <textarea rows="2" class="step-desc w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none resize-y" placeholder="Describe this step in detail...">${data.desc}</textarea>
                        </div>
                        <div class="md:col-span-4 space-y-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Time / Temp</label>
                                <input type="text" value="${data.timeTemp}" class="step-timetemp w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-[#144D37] focus:border-[#144D37] focus:bg-white bg-slate-50/70 border-slate-200 shadow-inner outline-none" placeholder="e.g., 10 mins / 180°C">
                            </div>
                            <div class="flex items-center pt-1">
                                <input type="checkbox" class="step-critical w-4 h-4 text-danger border-slate-300 rounded focus:ring-danger cursor-pointer" ${data.isCritical ? 'checked' : ''}>
                                <label class="ml-2 text-sm font-medium text-slate-700 cursor-pointer flex items-center" onclick="this.previousElementSibling.click()">
                                    <i class="fas fa-exclamation-triangle text-amber-500 mr-1 text-xs"></i> Critical Checkpoint
                                </label>
                            </div>
                        </div>
                    </div>
                `;
                cont.appendChild(div);
            },

            removeStep(btn) {
                btn.closest('.step-row').remove();
                // Update numbers
                const rows = document.querySelectorAll('.step-row .step-num');
                rows.forEach((el, index) => {
                    el.innerText = index + 1;
                });
            },

            saveRecipe(e) {
                e.preventDefault();

                // Gather data
                const recipe = {
                    id: this.currentRecipeId || this.generateId(),
                    title: document.getElementById('recipeTitle').value,
                    category: document.getElementById('recipeCategory').value,
                    station: document.getElementById('recipeStation').value,
                    prepTime: document.getElementById('recipePrepTime').value,
                    cookTime: document.getElementById('recipeCookTime').value,
                    yield: document.getElementById('recipeYieldNum') ? (document.getElementById('recipeYieldNum').value + ' ' + document.getElementById('recipeYieldUnit').value).trim() : document.getElementById('recipeYield').value,
                    shelfLife: document.getElementById('recipeShelfLife').value,
                    costing: document.getElementById('recipeCosting').value,
                    ingredients: [],
                    equipment: [],
                    steps: [],
                    updatedAt: new Date().toISOString()
                };

                // Ingredients
                document.querySelectorAll('.ing-row').forEach(row => {
                    const name = row.querySelector('.ing-name').value.trim();
                    if (name) {
                        recipe.ingredients.push({
                            name: name,
                            qty: row.querySelector('.ing-qty').value.trim(),
                            unit: row.querySelector('.ing-unit').value.trim(),
                            notes: row.querySelector('.ing-notes').value.trim()
                        });
                    }
                });

                // Equipment
                document.querySelectorAll('.eq-row .eq-val').forEach(input => {
                    const val = input.value.trim();
                    if (val) recipe.equipment.push(val);
                });

                // Steps
                document.querySelectorAll('.step-row').forEach(row => {
                    const desc = row.querySelector('.step-desc').value.trim();
                    if (desc) {
                        recipe.steps.push({
                            desc: desc,
                            timeTemp: row.querySelector('.step-timetemp').value.trim(),
                            isCritical: row.querySelector('.step-critical').checked
                        });
                    }
                });

                // Save
                if (this.currentRecipeId) {
                    const idx = this.recipes.findIndex(r => r.id === this.currentRecipeId);
                    if (idx > -1) this.recipes[idx] = recipe;
                } else {
                    this.recipes.push(recipe);
                }

                this.saveData();
                    this.updateCatalogWithSubRecipes();
                                                        this.showSOP(recipe.id);
            },

            // SOP View Logic
            renderSOPView(recipeId) {
                const recipe = this.recipes.find(r => r.id === recipeId);
                if (!recipe) return this.showDashboard();

                // Header info
                document.getElementById('viewTitle').innerText = recipe.title;
                document.getElementById('viewCategoryBadge').innerText = recipe.category;
                document.getElementById('viewStationBadge').innerText = recipe.station;
                
                document.getElementById('viewPrepTime').innerText = recipe.prepTime || '-';
                document.getElementById('viewCookTime').innerText = recipe.cookTime || '-';
                document.getElementById('viewYield').innerText = recipe.yield || '-';
                document.getElementById('viewShelfLife').innerText = recipe.shelfLife || '-';

                // Costing
                const costCont = document.getElementById('viewCostingContainer');
                const costText = document.getElementById('viewCosting');
                if (recipe.costing) {
                    costCont.classList.remove('hidden');
                    costText.innerText = recipe.costing;
                } else {
                    costCont.classList.add('hidden');
                }

                // Equipment
                const eqList = document.getElementById('viewEquipmentList');
                eqList.innerHTML = recipe.equipment.length > 0 
                    ? recipe.equipment.map(eq => `<li class="py-1 border-b border-slate-100 last:border-0">${eq}</li>`).join('')
                    : '<li class="text-slate-400 italic">None specified</li>';

                // Ingredients
                const ingList = document.getElementById('viewIngredientsList');
                if (recipe.ingredients.length > 0) {
                    ingList.innerHTML = recipe.ingredients.map(ing => `
                        <tr class="group hover:bg-slate-50 transition-colors">
                            <td class="py-2 pr-2 font-medium text-slate-800">${ing.name}</td>
                            <td class="py-2 pr-2 text-slate-600 whitespace-nowrap">${ing.qty} ${ing.unit}</td>
                            <td class="py-2 text-slate-500 text-xs italic text-right">${ing.notes}</td>
                        </tr>
                    `).join('');
                } else {
                    ingList.innerHTML = '<tr><td class="py-2 text-slate-400 italic">No ingredients listed</td></tr>';
                }

                // Steps
                const stepList = document.getElementById('viewStepsList');
                if (recipe.steps.length > 0) {
                    stepList.innerHTML = recipe.steps.map((step, index) => {
                        const stepId = `step_${index}`;
                        const criticalBadge = step.isCritical 
                            ? `<div class="mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <i class="fas fa-exclamation-triangle mr-1.5"></i> CRITICAL CHECKPOINT
                               </div>` 
                            : '';
                            
                        const timeTempBadge = step.timeTemp
                            ? `<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                <i class="far fa-clock mr-1"></i> ${step.timeTemp}
                               </span>`
                            : '';

                        return `
                            <div class="relative pl-10 md:pl-12 py-2 print-break-inside-avoid group">
                                <!-- Number Bubble -->
                                <div class="absolute left-0 top-2 bg-slate-800 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-sm z-10">
                                    ${index + 1}
                                </div>
                                <!-- Connecting line -->
                                ${index !== recipe.steps.length - 1 ? `<div class="absolute left-3.5 top-9 bottom-[-1rem] w-px bg-slate-200 -z-0"></div>` : ''}
                                
                                <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div class="flex items-start">
                                        <div class="pt-0.5 mr-3 no-print">
                                            <input type="checkbox" id="${stepId}" class="step-checkbox w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer transition-colors">
                                        </div>
                                        <div class="flex-grow">
                                            <label for="${stepId}" class="text-base text-slate-800 cursor-pointer block leading-relaxed break-words">
                                                ${step.desc.replace(/\\n/g, '<br>')}
                                                ${timeTempBadge}
                                            </label>
                                            ${criticalBadge}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    stepList.innerHTML = '<p class="text-slate-400 italic">No steps defined.</p>';
                }
            },

            editCurrentRecipe() {
                this.showForm(this.currentRecipeId);
            }
        };

        // Boot
        document.addEventListener('DOMContentLoaded', () => {
            sopApp.init();
        });
    