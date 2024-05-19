using Backend.Data;
using Backend.Models;
using Backend.Models.Cars;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class ContextSeedService
    {
        private readonly ApiDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public ContextSeedService(ApiDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task InitializeContextAsync()
        {
            if (_context.Database.GetPendingMigrationsAsync().GetAwaiter().GetResult().Count() > 0)
            {
                // applies any pending migration into our database
                await _context.Database.MigrateAsync();
            }

            if (!_roleManager.Roles.Any())
            {
                await _roleManager.CreateAsync(new IdentityRole { Name = SD.AdminRole });
                await _roleManager.CreateAsync(new IdentityRole { Name = SD.ClientRole });

            }

            if (!_userManager.Users.AnyAsync().GetAwaiter().GetResult())
            {
                var admin = new User
                {
                    FullName = "seed admin",                
                    UserName = SD.AdminUserName,
                    Email = SD.AdminUserName,
                    Phone = "0712345678",
                    Address = "Cluj",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(admin, "123456");
                await _userManager.AddToRolesAsync(admin, new[] { SD.AdminRole, SD.ClientRole });
                await _userManager.AddClaimsAsync(admin, new Claim[]
                {
                    new Claim(ClaimTypes.Email, admin.Email),
                    new Claim("fullname", admin.FullName)
                });

                var client = new User
                {
                    FullName = "seed client",
                    UserName = "client@example.com",
                    Email = "client@example.com",
                    Phone="0712345678",
                    Address="Cluj",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(client, "123456");
                await _userManager.AddToRoleAsync(client, SD.ClientRole);
                await _userManager.AddClaimsAsync(client, new Claim[]
                {
                    new Claim(ClaimTypes.Email, client.Email),
                    new Claim("fullname", admin.FullName)
                });
            }
            {
                string[] marks = [
                    "BMW",
                    "Audi",
                    "Volkswagen",
                    "Mercedes-Benz",
                    "Skoda",
                    "Dacia",
                    "Volvo",
                    "Mazda",
                    "Ford",
                    "Toyota",
                    "Jaguar",
                    "Suzuki",
                    "SEAT",
                    "Renault",
                    "Opel"
                ];
                foreach (string m in marks)
                {
                    var mark = new Mark
                    {
                        Name = m
                    };
                    _context.Marks.Add(mark);
                    await _context.SaveChangesAsync();
                }
            }

            {
                List<string[]> models = new List<string[]>();
                models.Add(
                    ["Seria 3 E90", "Seria 5 E60", "Seria 7 F01", "X3 E83", "X6 E71"]
                    );
                models.Add(
                    ["A4 B8", "Q5 8R", "A6 4F", "A3 8P", "TT 8J"]
                    );
                models.Add(
                    ["Golf 5", "Passat CC", "Tiguan I", "Touareg I", "Touran I"]
                    );
                models.Add(
                    ["A Class W176", "C Class C205", "S Class W221", "GLE C167", "GLC X253"]
                    );
                models.Add(
                    ["Octavia II", "Superb I", "Fabia I", "Kodiaq I", "Scala"]
                    );
                models.Add(
                    ["Logan", "Duster", "Sandero", "Jogger", "Dokker"]
                    );
                models.Add(
                    ["XC60 I", "S90", "V60 I", "V90", "S40 II"]
                    );
                models.Add(
                    ["Mazda 3 I", "Mazda 6 III", "CX-9", "MX-5 I", "CX-30"]
                    );
                models.Add(
                    ["Fiesta VII", "Focus II", "Kuga II", "Mustang VI", "Ka II"]
                    );
                models.Add(
                    ["Yaris III", "Land Cruiser J200", "Auris", "C-HR", "RAV4 II XA20"]
                    );
                models.Add(
                    ["XF X250", "F-Pace", "XJ X351", "XE X760", "E-Pace"]
                    );
                models.Add(
                    ["Grand Vitara FT/GT", "Ignis II", "Jimny III", "Swift IV", "SX4 I"]
                    );
                models.Add(
                    ["Ibiza III", "Leon II", "Toledo III", "Altea", "Arona"]
                    );
                models.Add(
                    ["Clio III", "Megane II", "Scenic III", "Kadjar", "Captur II"]
                    );
                models.Add(
                    ["Astra H", "Corsa D", "Insignia", "Zafira B", "Antara"]
                    );
                for (int i = 1; i <= models.Count; i++)
                {
                    var mark = await _context.Marks.FindAsync(i);
                    foreach(string s in models.ElementAt(i - 1))
                    {
                        var model = new Model
                        {
                            Name = s,
                            Mark = mark
                        };
                        _context.Models.Add(model);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            {
                List<string[]> engines = new List<string[]>();
                engines.Add(
                    ["320i", "320d"]);
                engines.Add(
                    ["520i", "520d"]);
                engines.Add(
                    ["740i", "730d"]);
                engines.Add(
                    ["20i", "30d"]);
                engines.Add(
                    ["50i", "40d"]);

                engines.Add(
                    ["2.0 TDI", "2.0TFSI"]);
                engines.Add(
                    ["3.0 TDI", "3.2 FSI"]);
                engines.Add(
                    ["2.7 TDI", "3.2 FSI"]);
                engines.Add(
                    ["1.9 TDI", "2.0 FSI"]);
                engines.Add(
                    ["2.0 TDI", "2.0 FSI"]);

                engines.Add(
                    ["1.9 TDI", "1.6 FSI"]);
                engines.Add(
                    ["2.0 TDI", "2.0 FSI"]);
                engines.Add(
                    ["2.0 TDI", "2.0 FSI"]);
                engines.Add(
                    ["3.0 TDI", "4.2 FSI"]);
                engines.Add(
                    ["1.9 TDI", "2.0 FSI"]);

                engines.Add(
                    ["A 200 CDI", "A 180"]);
                engines.Add(
                    ["C 180", "C 300"]);
                engines.Add(
                    ["S 320 CDI", "S 500"]);
                engines.Add(
                    ["GLE 400d", "AMG GLE 53"]);
                engines.Add(
                    ["GLC 220d", "GLC 250"]);

                engines.Add(
                    ["1.9 TDI", "1.6 MPI"]);
                engines.Add(
                    ["2.5 TDI", "1.8 T"]);
                engines.Add(
                    ["1.4 TDI", "1.4 16V"]);
                engines.Add(
                    ["2.0 TDI", "1.5 TSI"]);
                engines.Add(
                    ["1.6 TDI", "1.0 TSI"]);

                engines.Add(
                    ["1.5 dCi", "1.0 12V"]);
                engines.Add(
                    ["1.5 dCi", "1.6"]);
                engines.Add(
                    ["1.5 dCi", "1.6 8V"]);
                engines.Add(
                    ["1.0 TCe", "1.6"]);
                engines.Add(
                    ["1.5 dCi", "1.6 MPI"]);

                engines.Add(
                    ["2.4 D4", "2.0 T5"]);
                engines.Add(
                    ["2.0 D5", "2.0 T6"]);
                engines.Add(
                    ["2.0 D2", "2.0 T4"]);
                engines.Add(
                    ["2.0 D3", "2.0 T5"]);
                engines.Add(
                    ["1.6 D2", "1.6i"]);

                engines.Add(
                    ["1.6 CD", "1.6i"]);
                engines.Add(
                    ["2.5 SKYACTIV-D", "2.2 SKYACTIV-G"]);
                engines.Add(
                    ["3.7 V6", "3.5 DOHC V6"]);
                engines.Add(
                    ["1.6", "1.8i"]);
                engines.Add(
                    ["1.8 SKYACTIV-D", "2.0 SKYACTIV-G"]);

                engines.Add(
                    ["1.6 TDCi", "1.4"]);
                engines.Add(
                    ["2.0 TDCi", "2.0 16V"]);
                engines.Add(
                    ["2.0 TDCi", "2.5 i 20V"]);
                engines.Add(
                    ["2.3 GTDi EcoBoost", "3.7 V6"]);
                engines.Add(
                    ["1.3 TDCi", "1.2"]);

                engines.Add(
                    ["1.4 D-4D", "1.0 VVT-i"]);
                engines.Add(
                    ["4.5d V8", "5.7 V8"]);
                engines.Add(
                    ["1.4 D-4D", "1.8 VVT-i"]);
                engines.Add(
                    ["1.8", "1.2"]);
                engines.Add(
                    ["2.0 16V D-4D", "2.4i"]);

                engines.Add(
                    ["3.0d V6", "5.0 V8"]);
                engines.Add(
                    ["3.0d", "3.0i"]);
                engines.Add(
                    ["3.0d V6", "5.0 V8"]);
                engines.Add(
                    ["2.0d", "3.0 V6"]);
                engines.Add(
                    ["2.0d", "1.5i"]);

                engines.Add(
                    ["2.0 TD", "2.0 i 16V"]);
                engines.Add(
                    ["1.2 DualJet", ""]);
                engines.Add(
                    ["1.5 DDiS", "1.3 VVT"]);
                engines.Add(
                    ["1.3 DDiS", "1.5 i 16V"]);
                engines.Add(
                    ["2.0 DDiS", "1.6 VVT"]);

                engines.Add(
                    ["1.4 TDI", "1.6"]);
                engines.Add(
                    ["1.9 TDI", "1.6 MPI"]);
                engines.Add(
                    ["2.0 TDI", "1.8 TSI"]);
                engines.Add(
                    ["1.6 TDI", "1.2 TSI"]);
                engines.Add(
                    ["1.6 TDI", "1.0 TSI"]);

                engines.Add(
                    ["1.5 dCi", "1.6i 16V"]);
                engines.Add(
                    ["1.9 dCi", "2.0 16V"]);
                engines.Add(
                    ["1.5 dCi", "1.6 16V"]);
                engines.Add(
                    ["1.7 Blue dCi", "1.3 TCe"]);
                engines.Add(
                    ["1.5 Blue dCi", "1.3 TCe"]);

                engines.Add(
                    ["1.9 CDTI ECOTEC", "1.6 ECOTEC"]);
                engines.Add(
                    ["1.3 CDTI", "1.6 LER"]);
                engines.Add(
                    ["2.0 CDTI", "1.8i"]);
                engines.Add(
                    ["1.9 CDTI", "1.8 XER"]);
                engines.Add(
                    ["2.0 CDTI", "2.4 16V"]);

                for (int i = 1; i <= engines.Count; i++)
                {
                    var model = await _context.Models.FindAsync(i);
                    foreach (string s in engines.ElementAt(i - 1))
                    {
                        var engine = new Engine
                        {
                            Name = s,
                            Model = model
                        };
                        _context.Engines.Add(engine);
                        await _context.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
