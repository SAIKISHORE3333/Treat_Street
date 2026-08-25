
        window.app = {
            recipes: [],
            currentRecipeId: null,
            inventory: [
                { id: 'PKG-001', name: 'CaterPro 100 Wooden Dessert Spoons' },
                { id: 'PKG-002', name: 'CaterPro 100 Wooden Forks' },
                { id: 'PKG-003', name: 'JR Foods & Packaging Services 7" Pizza Box Plain Brown 100pcs' },
                { id: 'PKG-004', name: 'Waffle cones' },
                { id: 'PKG-005', name: 'Cone tissues' },
                { id: 'CLN-001', name: 'Cif Lemon Cream Cleaner 500 ml' },
                { id: 'CLN-002', name: 'CleanPro 10 Scouring Pads' },
                { id: 'CLN-003', name: 'CleanPro 10 Stainless Steel Scourers Medium' },
                { id: 'CLN-004', name: 'CleanPro+ Heavy Duty Cleaner Degreaser 5 Litres' },
                { id: 'CLN-005', name: 'CleanPro+ Oven and Grill Cleaner 1 Litre' },
                { id: 'CLN-006', name: 'Clearly 100 Blue Vinyl Powder-Free Gloves (Large)' },
                { id: 'CLN-007', name: 'Fairy Professional Washing Up Liquid Original 900ML' },
                { id: 'CLN-008', name: 'Flash Professional All Purpose Cleaner, 5L' },
                { id: 'CLN-009', name: 'Euro Shopper Citrus Thick Bleach 750ml' },
                { id: 'RAW-001', name: 'Betty Crocker Indulgent Chocolate Fudge Icing 400g' },
                { id: 'RAW-002', name: 'Billington\'s Dark Brown Soft Natural Unrefined Cane Sugar 500g' },
                { id: 'RAW-003', name: 'Billington\'s Light Brown Soft Natural Unrefined Cane Sugar 3kg' },
                { id: 'RAW-004', name: 'Billington\'s Light Brown Soft Natural Unrefined Cane Sugar 500g' },
                { id: 'RAW-005', name: 'Biscoff Biscuit Crumbs 750g' },
                { id: 'RAW-006', name: 'Curtis Catering Chopped Mixed Nuts 1kg' },
                { id: 'RAW-007', name: 'Dr. Oetker Baking Powder 170g' },
                { id: 'RAW-008', name: 'Dr. Oetker Madagascan Vanilla Extract 35ml' },
                { id: 'RAW-009', name: 'Lichfields Fairtrade White Sugar 2kg' },
                { id: 'RAW-010', name: 'McVitie\'s Digestives The Original Biscuits 360g' },
                { id: 'RAW-011', name: 'Nic Caramel Mini Fudge Cubes 1kg' },
                { id: 'RAW-012', name: 'Nic Sugar Strands Vegan 1.0kg' },
                { id: 'RAW-013', name: 'OREO Original Vanilla Sandwich Biscuits' },
                { id: 'RAW-014', name: 'Paterson\'s Shortbread Fingers 300g' },
                { id: 'RAW-015', name: 'Silver Spoon British Icing Sugar 3kg' },
                { id: 'RAW-016', name: 'Silver Spoon Granulated Sugar 1kg' },
                { id: 'RAW-017', name: 'Sweetex Calorie Free Sweeteners 1200 Tablets' },
                { id: 'RAW-018', name: 'Fuel granola' },
                { id: 'RAW-019', name: 'Seeds and fruit mix' },
                { id: 'RAW-020', name: 'James Brown cornflour' },
                { id: 'RAW-021', name: 'Waffle mix powder' },
                { id: 'RAW-022', name: 'Vegan waffle mix powder' },
                { id: 'RAW-023', name: 'Chef\'s Essentials Chopped Tomatoes in Tomato Juice 2.5kg' },
                { id: 'RAW-024', name: 'Chef\'s Larder Salt 6kg' },
                { id: 'RAW-025', name: 'Chef\'s Larder White Wine Vinegar 2 Litres' },
                { id: 'RAW-026', name: 'Chef\'s Menu Garlic Powder 500g' },
                { id: 'RAW-027', name: 'Chef\'s Menu Cayenne Pepper 460g' },
                { id: 'RAW-028', name: 'Chef\'s Menu Chipotle Sauce 1 litre' },
                { id: 'RAW-029', name: 'Chef\'s Menu Ground Black Pepper 500g' },
                { id: 'RAW-030', name: 'Chef\'s Menu Ground Sweet Cinnamon 430g' },
                { id: 'RAW-031', name: 'Chef\'s Menu Onion Powder 480g' },
                { id: 'RAW-032', name: 'Chef\'s Menu Salsa 1 litre' },
                { id: 'RAW-033', name: 'Chef\'s Menu Smoked Paprika 430g' },
                { id: 'RAW-034', name: 'Frank\'s Red Hot Wings Buffalo Sauce 3.78l' },
                { id: 'RAW-035', name: 'Heinz Professional Mayonnaise 10L' },
                { id: 'RAW-036', name: 'Heinz Tomato Ketchup 4.5kg' },
                { id: 'RAW-037', name: 'Monin Caramel 100cl' },
                { id: 'RAW-038', name: 'Mrs Elswood Burger Gherkins 670g' },
                { id: 'RAW-039', name: 'Roquito Hot Honey 720g' },
                { id: 'RAW-040', name: 'Snow Shock Blue Raspberry Premium Slush Syrup 5 Litres' },
                { id: 'RAW-041', name: 'Spice Magic Raita' },
                { id: 'RAW-042', name: 'Spice Magic Smooth Mango Chutney 1.2kg' },
                { id: 'RAW-043', name: 'KTC vegetable oil' },
                { id: 'RAW-044', name: 'Nacho cheese' },
                { id: 'RAW-045', name: 'Mayonnaise' },
                { id: 'RAW-046', name: 'Chef\'s Larder Lightly Salted Tortilla Chips 454g' },
                { id: 'RAW-047', name: 'Comelle Ice Cream Mix 1 Litre' },
                { id: 'RAW-048', name: 'Koffmann\'s Potatoes Les Pommes Frites' },
                { id: 'RAW-049', name: 'KTC Crispy Fried Onions 400g' },
                { id: 'RAW-050', name: 'McCain Original Choice Potato Hash Browns 1kg' },
                { id: 'RAW-051', name: 'McCain Potato Pops 2.5kg' },
                { id: 'RAW-052', name: 'Müller Müllerlicious Whole Milk 2 Litre' },
                { id: 'RAW-053', name: 'Müller Semi Skimmed Milk 2 Litres' },
                { id: 'RAW-054', name: 'Oatly Oat Drink Barista Edition 1L Long Life' },
                { id: 'RAW-055', name: 'St Pierre 4 Pre-Sliced Brioche Burger Buns' },
                { id: 'RAW-056', name: 'St Pierre 4 Seeded Brioche Burger Buns' },
                { id: 'RAW-057', name: 'St Pierre Brioche Loaf 500g' },
                { id: 'RAW-058', name: 'Whipped cream' },
                { id: 'RAW-059', name: 'Frozen mixed berries' },
                { id: 'RAW-060', name: 'St Pierre Brioche buns' },
                { id: 'RAW-061', name: 'Eggs' },
                { id: 'RAW-062', name: 'Apple pie filling' },
                { id: 'RAW-063', name: 'Red cherry pie filling' },
                { id: 'RAW-064', name: 'New york style cheesecake' },
                { id: 'RAW-065', name: 'All butter croissant' },
                { id: 'RAW-066', name: 'Passion shoot smoothie packet' },
                { id: 'RAW-067', name: 'Melon refresher smoothie packet' },
                { id: 'RAW-068', name: 'Avo go go smoothie packet' },
                { id: 'RAW-069', name: 'Detox zing smoothie packet' },
                { id: 'RAW-070', name: 'Triple chocolate brownie' },
                { id: 'RAW-071', name: 'Frozen waffles' },
                { id: 'RAW-072', name: 'Cadbury Drinking Hot Chocolate Cocoa Powder 2KG' },
                { id: 'RAW-073', name: 'Coca-Cola Original Taste 330ml Glass Bottle' },
                { id: 'RAW-074', name: 'Diet Coke Cola Glass Bottles' },
                { id: 'RAW-075', name: 'Fanta Orange 330ml' },
                { id: 'RAW-076', name: 'Hershey\'s Cookies \'N\' Creme 40g' },
                { id: 'RAW-077', name: 'Huel Banana Flavour Ready-to-Drink 500ml' },
                { id: 'RAW-078', name: 'J20 Apple & Mango 275ml' },
                { id: 'RAW-079', name: 'J20 Apple & Raspberry 275ml' },
                { id: 'RAW-080', name: 'J20 Orange & Passion Fruit 275ml' },
                { id: 'RAW-081', name: 'Jack Rabbit Signature Malbec Red Wine 75cl' },
                { id: 'RAW-082', name: 'Jack\'s Pure Apple Juice 1 Litre' },
                { id: 'RAW-083', name: 'Maltesers Milk Chocolate Bag 37g PMP' },
                { id: 'RAW-084', name: 'Mini Eggs' },
                { id: 'RAW-085', name: 'Passoã Passion Fruit Liqueur 70cl' },
                { id: 'RAW-086', name: 'Perfect Ted Ceremonial Grade Matcha 100g' },
                { id: 'RAW-087', name: 'Sprite Zero Sugar 330ml' },
                { id: 'RAW-088', name: 'Strathmore Sparkling Spring Water 330ml' },
                { id: 'RAW-089', name: 'Strathmore Still Spring Water 750ml' },
                { id: 'RAW-090', name: 'Kinder bueno' },
                { id: 'RAW-091', name: 'Ferrero rocher' },
                { id: 'RAW-092', name: 'Skittles' },
                { id: 'RAW-093', name: 'J20 apple and mango' },
                { id: 'RAW-094', name: 'J20 orange and passionfruit' },
                { id: 'RAW-095', name: 'J20 apple and raspberry' },
                { id: 'RAW-096', name: 'Lemon and elderflower tea' },
                { id: 'RAW-097', name: 'Green tea' },
                { id: 'RAW-098', name: 'Earl grey tea' },
                { id: 'RAW-099', name: 'Vanilla chai latte powder' },
                { id: 'RAW-100', name: 'Spice chai latte powder' },
                { id: 'RAW-101', name: 'Coffee Beans' },
                { id: 'RAW-102', name: 'Raspberry sorbet' },
                { id: 'RAW-103', name: 'Mango sorbet' },
                { id: 'RAW-104', name: 'Passionfruit sorbet' },
                { id: 'RAW-105', name: 'Biscoff gelato' },
                { id: 'RAW-106', name: 'Cherry yoghurt gelato' },
                { id: 'RAW-107', name: 'Rumon raisin gelato' },
                { id: 'RAW-108', name: 'Coffee gelato' },
                { id: 'RAW-109', name: 'Honeycomb gelato' },
                { id: 'RAW-110', name: 'Bubblegum gelato' },
                { id: 'RAW-111', name: 'Coconut gelato' },
                { id: 'RAW-112', name: 'Eton mess gelato' },
                { id: 'RAW-113', name: 'Cinnamon gelato' },
                { id: 'RAW-114', name: 'Salted caramel gelato' },
                { id: 'RAW-115', name: 'Smores gelato' },
                { id: 'RAW-116', name: 'Oreo gelato' },
                { id: 'RAW-117', name: 'Strawberry gelato' },
                { id: 'RAW-118', name: 'Pistachio gelato' },
                { id: 'RAW-119', name: 'Peanutella gelato' },
                { id: 'RAW-120', name: 'Ambassador gelato' },
                { id: 'RAW-121', name: 'Vanilla gelato' },
                { id: 'RAW-122', name: 'Dulce de leche gelato' },
                { id: 'RAW-123', name: 'Cherries and custard gelato' },
                { id: 'RAW-124', name: 'Mascarpone gelato' },
                { id: 'RAW-125', name: 'Ciokamenta gelato' },
                { id: 'RAW-126', name: 'Vegan vanilla gelato' },
                { id: 'RAW-127', name: 'Scoopable acai' },
                { id: 'RAW-128', name: 'Vegan chocolate gelato' },
                { id: 'RAW-129', name: 'Vegan salted caramel gelato' }
            ],
            
            // Supabase Setup
            supabase: null,

            // Initialization
            catalog: [],
            
            updateCatalogWithSubRecipes() {
                // Remove existing sub-recipes from catalog to prevent duplicates
                this.catalog = this.catalog.filter(item => item.category !== 'Sub-Recipe');
                
                let maxId = this.catalog.reduce((max, item) => (typeof item.id === 'number' && item.id > max) ? item.id : max, 0);

                if (this.recipes && Array.isArray(this.recipes)) {
                    for (const recipe of this.recipes) {
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
            async init() {
                // Load Catalog
                const localCatalog = localStorage.getItem('ts_shared_catalog');
                this.catalog = localCatalog ? JSON.parse(localCatalog) : (window.tsCatalog ? window.tsCatalog : []);
                
                // Build Datalist
                let datalist = document.getElementById('ingredient-catalog-list');
                if (!datalist) {
                    datalist = document.createElement('datalist');
                    datalist.id = 'ingredient-catalog-list';
                    document.body.appendChild(datalist);
                }
                datalist.innerHTML = this.catalog.map(i => `<option value="${i.name.replace(/"/g, '&quot;')}">`).join('');

                // Initialize Supabase (Replace these placeholders with your actual keys!)
                const supabaseUrl = 'https://sdlrwosjebiiztclsydu.supabase.co';
                const supabaseKey = 'sb_publishable_NhC960waOrCWgb5UOg5O1A_l0BNUaOD';
                this.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

                await this.loadData();
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
            
            async loadData() {
                try {
                    const { data, error } = await this.supabase
                        .from('sop_recipes')
                        .select('*')
                        .order('updatedAt', { ascending: false });
                    
                    if (error) throw error;
                    this.recipes = data || [];
                } catch(e) {
                    console.error("Supabase load error:", e);
                    // Fallback to local storage if supabase isn't configured yet
                    const localData = localStorage.getItem('recipeSOPs');
                    if (localData) this.recipes = JSON.parse(localData);
                }
            },

            async saveData(recipe) {
                try {
                    // Update in Supabase
                    if (recipe && this.supabase) {
                        const { error } = await this.supabase
                            .from('sop_recipes')
                            .upsert([recipe]);
                        if (error) throw error;
                    }
                    // Also save locally as a backup
                    localStorage.setItem('recipeSOPs', JSON.stringify(this.recipes));
                } catch(e) {
                    console.error("Supabase save error:", e);
                    localStorage.setItem('recipeSOPs', JSON.stringify(this.recipes));
                }
            },

            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            },

            // Navigation
            hideAllViews() {
                Array.from(document.querySelectorAll('.view-section')).forEach(el => el.classList.add('hidden'));
                window.scrollTo(0, 0);
            },

            showDashboard() {
                this.hideAllViews();
                document.getElementById('dashboardView').classList.remove('hidden');
                this.renderDashboard();
            },

            showForm(recipeId) {
                this.hideAllViews();
                document.getElementById('formView').classList.remove('hidden');
                
                if (typeof recipeId === 'string') {
                    this.currentRecipeId = recipeId;
                    document.getElementById('formTitle').innerText = 'Edit Recipe SOP';
                    this.populateForm(recipeId);
                } else {
                    this.currentRecipeId = null;
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
                                    <button onclick="event.stopPropagation(); app.deleteRecipe('${recipe.id}')" class="text-slate-300 hover:text-danger transition-colors p-1" title="Delete">
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

            async deleteRecipe(id) {
                if (confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
                    try {
                        const { error } = await this.supabase
                            .from('sop_recipes')
                            .delete()
                            .eq('id', id);
                        if (error) throw error;
                    } catch(e) {
                        console.error("Supabase delete error:", e);
                    }
                    this.recipes = this.recipes.filter(r => r.id !== id);
                    await this.saveData(null);
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
                document.getElementById('recipeYield').value = recipe.yield;
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
                
                let optionsHtml = '<option value="">Select Ingredient...</option>';
                this.inventory.forEach(item => {
                    const label = `[${item.id}] ${item.name}`;
                    const selected = (data.name === label || data.name === item.name) ? 'selected' : '';
                    optionsHtml += `<option value="${label.replace(/"/g, '&quot;')}" ${selected}>${label}</option>`;
                });
                
                const inInventory = this.inventory.some(item => `[${item.id}] ${item.name}` === data.name || item.name === data.name);
                if (data.name && !inInventory) {
                    optionsHtml += `<option value="${data.name.replace(/"/g, '&quot;')}" selected>${data.name}</option>`;
                }

                tr.innerHTML = `
                    <td class="py-2 pr-2">
                        <select class="ing-name w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
                            ${optionsHtml}
                        </select>
                    </td>
                    <td class="py-2 pr-2">
                        <input type="text" value="${data.qty}" placeholder="0" class="ing-qty w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none" oninput="app.calculateRowCost(this)">
                    </td>
                    <td class="py-2 pr-2">
                        <select class="ing-unit onchange="app.calculateRowCost(this)" w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
                            <option value="">Unit...</option>
                            <option value="g" ${data.unit === 'g' || data.unit === 'gms' ? 'selected' : ''}>g / gms</option>
                            <option value="kg" ${data.unit === 'kg' ? 'selected' : ''}>kg</option>
                            <option value="ml" ${data.unit === 'ml' ? 'selected' : ''}>ml</option>
                            <option value="L" ${data.unit === 'L' ? 'selected' : ''}>L</option>
                            <option value="pcs" ${data.unit === 'pcs' ? 'selected' : ''}>pcs</option>
                            <option value="tsp" ${data.unit === 'tsp' ? 'selected' : ''}>tsp</option>
                            <option value="tbsp" ${data.unit === 'tbsp' ? 'selected' : ''}>tbsp</option>
                            <option value="cup" ${data.unit === 'cup' ? 'selected' : ''}>cup</option>
                            <option value="bunch" ${data.unit === 'bunch' ? 'selected' : ''}>bunch</option>
                        </select>
                    </td>
                    <td class="py-2 pr-2">
                        <input type="text" value="${data.notes.replace(/"/g, '&quot;')}" placeholder="Notes..." class="ing-notes w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none">
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
                    <input type="text" value="${val.replace(/"/g, '&quot;')}" placeholder="Equipment item (e.g., 20L Stock pot)" class="eq-val flex-grow px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none">
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
                        <button type="button" onclick="app.removeStep(this)" class="text-slate-300 hover:text-danger p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                        <div class="md:col-span-8">
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Instruction</label>
                            <textarea rows="2" class="step-desc w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-y" placeholder="Describe this step in detail...">${data.desc}</textarea>
                        </div>
                        <div class="md:col-span-4 space-y-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Time / Temp</label>
                                <input type="text" value="${data.timeTemp}" class="step-timetemp w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="e.g., 10 mins / 180°C">
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
                Array.from(document.querySelectorAll('.step-row .step-num')).forEach((el, index) => {
                    el.innerText = index + 1;
                });
            },

            async saveRecipe(e) {
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
                Array.from(document.querySelectorAll('.ing-row')).forEach(row => {
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
                Array.from(document.querySelectorAll('.eq-row .eq-val')).forEach(input => {
                    const val = input.value.trim();
                    if (val) recipe.equipment.push(val);
                });

                // Steps
                Array.from(document.querySelectorAll('.step-row')).forEach(row => {
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

                await this.saveData(recipe);
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
            app.init();
        });
    