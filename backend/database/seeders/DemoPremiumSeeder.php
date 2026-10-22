<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Detalles de EJEMPLO para la categoría Premium (solo plan Pro).
 * Solo corre en entorno local; se puede volver a correr sin duplicar nada.
 * Usa las imágenes y los autores que ya carga DemoSeeder, así que corre después de ese.
 */
class DemoPremiumSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command->warn('DemoPremiumSeeder solo corre en entorno local.');
            return;
        }

        $data = json_decode(file_get_contents(database_path('seeders/data/seed.json')), true);
        $now = now();

        $premiumId = DB::table('categories')->whereNull('parent_id')->where('slug', 'premium')->value('id');
        $proId = DB::table('plans')->where('slug', 'pro')->value('id');

        if (! $premiumId || ! $proId) {
            $this->command->warn('Falta la categoría Premium o el plan Pro: corré CategorySeeder y PlanSeeder primero.');
            return;
        }

        // Imágenes de los detalles que ya existen (se reutilizan para que se vean bien)
        $covers = array_column($data['details'], 'imageUrl');
        $drawings = $data['details'][0]['drawings'];

        $items = [
            [
                'title' => 'Muro Cortina Unitizado de Gran Altura',
                'author' => 'Arq. Elena Foster', 'tags' => ['Acero', 'Prefabricado', 'Premium'],
                'description' => 'Sistema de fachada ligera formada por módulos de vidrio y aluminio prefabricados en taller, que se cuelgan de los forjados. Resuelve la estanqueidad, la dilatación y el anclaje a la estructura en edificios de gran altura.',
                'specs' => ['Módulo tipo: 1,50 m x 3,60 m (un piso)', 'Vidrio: DVH laminado 6+6 / cámara 16 mm / 8 mm templado', 'Perfilería: aluminio anodizado con rotura de puente térmico', 'Anclaje: ménsula regulable en 3 ejes sobre inserto en losa', 'Estanqueidad: doble barrera de burletes + drenaje de cámara'],
                'materials' => ['Perfiles de aluminio extruido', 'Vidrio DVH laminado', 'Burlete EPDM', 'Insertos de acero galvanizado', 'Sellador estructural de silicona'],
                'cover' => 2, 'verified' => true, 'votes' => 312, 'date' => '2025-02-10',
            ],
            [
                'title' => 'Losa Postesada sin Vigas (Placa Plana)',
                'author' => 'Ing. Roberto Molinari', 'tags' => ['Hormigón', 'Acero', 'Premium'],
                'description' => 'Losa maciza de hormigón con cables de acero postensados que permite grandes luces con espesores reducidos y cielorraso liso, sin vigas descolgadas. Incluye la disposición de vainas y la zona de anclajes.',
                'specs' => ['Hormigón: H-35, resistencia a la transferencia al 75%', 'Espesor: L/40 (luz de 8,00 m: 20 cm)', 'Cables: cordones de 0,6" en vainas engrasadas', 'Recubrimiento: 30 mm (cables) / 25 mm (armadura pasiva)', 'Armadura pasiva de refuerzo en apoyos y zona de punzonado'],
                'materials' => ['Hormigón H-35', 'Cordones de acero de pretensado', 'Vainas plásticas', 'Anclajes activos y pasivos', 'Armadura pasiva ADN 420'],
                'cover' => 4, 'verified' => true, 'votes' => 198, 'date' => '2025-02-18',
            ],
            [
                'title' => 'Fachada Doble Piel con Cámara Ventilada',
                'author' => 'Studio 4B', 'tags' => ['Sostenible', 'Acero', 'Premium'],
                'description' => 'Doble envolvente con una piel exterior de vidrio y una interior aislada, separadas por una cámara que ventila en verano y se cierra en invierno. Reduce la carga térmica y mejora el confort acústico.',
                'specs' => ['Cámara de aire: 60 cm con pasarela de mantenimiento', 'Piel exterior: vidrio templado simple con fijación puntual', 'Piel interior: carpintería con DVH y control solar', 'Aperturas motorizadas superior e inferior', 'Reducción de carga térmica estimada: 30-40%'],
                'materials' => ['Vidrio templado', 'Arañas de acero inoxidable', 'Carpintería de aluminio con RPT', 'Rejilla de piso metálica', 'Persianas motorizadas'],
                'cover' => 9, 'verified' => false, 'votes' => 127, 'date' => '2025-03-02',
            ],
            [
                'title' => 'Junta Sísmica entre Cuerpos de Edificio',
                'author' => 'Dr. Alan Grant', 'tags' => ['Hormigón', 'Acero', 'Premium'],
                'description' => 'Separación libre entre dos cuerpos estructurales para evitar el choque durante un sismo. Incluye el cubrejunta de piso, muro y cubierta que permite el movimiento sin perder terminación ni estanqueidad.',
                'specs' => ['Ancho de junta: según desplazamiento de cálculo (mín. 5 cm)', 'Cubrejunta de piso: perfil de aluminio con inserto elastomérico', 'Cubrejunta de muro: lámina flexible con fuelle', 'Junta de cubierta: fuelle impermeable con babeta', 'Sin elementos rígidos que crucen la junta'],
                'materials' => ['Perfiles de aluminio', 'Neopreno / EPDM', 'Planchuela de acero inoxidable', 'Sellador elástico de poliuretano', 'Espuma de polietileno'],
                'cover' => 8, 'verified' => true, 'votes' => 88, 'date' => '2025-03-15',
            ],
            [
                'title' => 'Piso Flotante de Aislación Acústica (Sala de Grabación)',
                'author' => 'Arq. Sofia Lopez', 'tags' => ['Madera', 'Sostenible', 'Premium'],
                'description' => 'Sistema "cuarto dentro del cuarto": una losa flotante apoyada sobre neoprenos desacopla el piso del resto de la estructura. Resuelve el aislamiento al ruido aéreo y de impacto en estudios y salas de música.',
                'specs' => ['Losa flotante de hormigón: 10 cm sobre lámina de polietileno', 'Apoyos: neoprenos de 40 Shore cada 60 cm', 'Cámara de lana mineral de 5 cm', 'Juntas perimetrales selladas con masilla acústica', 'Aislación estimada: Rw 60 dB'],
                'materials' => ['Hormigón con malla', 'Neoprenos antivibratorios', 'Lana mineral de alta densidad', 'Banda perimetral desolidarizante', 'Masilla acústica'],
                'cover' => 6, 'verified' => false, 'votes' => 64, 'date' => '2025-04-01',
            ],
            [
                'title' => 'Cubierta Verde Extensiva con Barrera Antirraíz',
                'author' => 'Urbana Labs', 'tags' => ['Sostenible', 'Premium'],
                'description' => 'Cubierta liviana con vegetación de bajo mantenimiento sobre membrana con barrera antirraíz. Incluye capa drenante con retención de agua, sustrato y detalle de borde con zona de grava.',
                'specs' => ['Sustrato: 8-10 cm de tierra liviana', 'Vegetación: sedum y crasas de bajo mantenimiento', 'Barrera antirraíz sobre membrana impermeable', 'Capa drenante con retención hídrica', 'Pendiente mínima: 2%'],
                'materials' => ['Membrana asfáltica con aditivo antirraíz', 'Geotextil filtrante', 'Panel drenante de polietileno', 'Sustrato liviano', 'Grava de borde'],
                'cover' => 3, 'verified' => true, 'votes' => 171, 'date' => '2025-04-12',
            ],
        ];

        foreach ($items as $i => $d) {
            $slug = Str::slug($d['title']);
            $authorId = DB::table('users')
                ->where('email', Str::slug($d['author']) . '@demo.endetalle.test')
                ->value('id');

            DB::table('details')->updateOrInsert(['slug' => $slug], [
                'title' => $d['title'],
                'description' => $d['description'],
                'category_id' => $premiumId,
                'subcategory_id' => null,
                'author_id' => $authorId,
                'required_plan_id' => $proId,
                'status' => 'published',
                'cover_url' => $covers[$d['cover'] % count($covers)],
                'specs' => json_encode($d['specs'], JSON_UNESCAPED_UNICODE),
                'materials' => json_encode($d['materials'], JSON_UNESCAPED_UNICODE),
                'is_verified' => $d['verified'],
                'votes_count' => $d['votes'],
                'published_at' => $d['date'],
                'created_at' => $now, 'updated_at' => $now,
            ]);

            $detailId = DB::table('details')->where('slug', $slug)->value('id');

            DB::table('detail_images')->where('detail_id', $detailId)->delete();
            foreach ([['section', 'Corte constructivo'], ['axonometric', 'Esquema axonométrico']] as $j => [$type, $caption]) {
                DB::table('detail_images')->insert([
                    'detail_id' => $detailId, 'type' => $type,
                    'url' => $drawings[$j]['url'], 'caption' => $caption,
                    'sort_order' => $j, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }

            foreach ($d['tags'] as $tag) {
                DB::table('tags')->insertOrIgnore([
                    'name' => $tag, 'slug' => Str::slug($tag),
                    'created_at' => $now, 'updated_at' => $now,
                ]);
                DB::table('detail_tag')->insertOrIgnore([
                    'detail_id' => $detailId,
                    'tag_id' => DB::table('tags')->where('name', $tag)->value('id'),
                ]);
            }
        }
    }
}
