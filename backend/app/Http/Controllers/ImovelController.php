<?php

namespace App\Http\Controllers;

use App\Models\Imovel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ImovelController extends Controller
{
    private const TIPOS = ['casa', 'apartamento', 'terreno', 'comercial'];
    private const STATUS = ['venda', 'aluguel'];

    public function index(Request $request)
    {
        $perPage = max(1, min(50, (int) $request->input('per_page', 12)));

        $query = Imovel::query()
            ->with(['imagens' => fn ($q) => $q->orderBy('ordem')]);

        $status = trim((string) $request->input('status', ''));
        if ($status && $status !== 'todos') {
            $query->where('status', $status);
        }

        $tipo = trim((string) $request->input('tipo', ''));
        if ($tipo && $tipo !== 'todos') {
            $query->where('tipo', $tipo);
        }

        if ($texto = trim((string) $request->input('q', ''))) {
            $query->where(function ($where) use ($texto) {
                $where->where('titulo', 'like', "%{$texto}%")
                    ->orWhere('descricao', 'like', "%{$texto}%")
                    ->orWhere('cidade', 'like', "%{$texto}%")
                    ->orWhere('bairro', 'like', "%{$texto}%")
                    ->orWhere('logradouro', 'like', "%{$texto}%");
            });
        }

        $ordem = $request->input('ordem');
        if ($ordem === 'menor-preco') {
            $query->orderBy('preco_centavos', 'asc');
        } elseif ($ordem === 'maior-preco') {
            $query->orderBy('preco_centavos', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $imoveis = $query
            ->paginate($perPage)
            ->through(fn (Imovel $imovel) => $this->transform($imovel));

        return response()->json($imoveis);
    }

    public function show(Imovel $imovel)
    {
        $imovel->loadMissing(['imagens' => fn ($q) => $q->orderBy('ordem')]);

        return response()->json($this->transform($imovel));
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        $imovel = Imovel::create($data + [
            'slug' => $this->makeUniqueSlug($data['titulo']),
            'user_id' => $request->user()->id,
        ]);

        $imovel->load(['imagens' => fn ($q) => $q->orderBy('ordem')]);

        return response()->json($this->transform($imovel), 201);
    }

    public function update(Request $request, Imovel $imovel)
    {
        $data = $this->validatePayload($request, true);

        if (array_key_exists('titulo', $data) && $data['titulo'] !== $imovel->titulo) {
            $imovel->slug = $this->makeUniqueSlug($data['titulo'], $imovel->id);
        }

        $imovel->fill($data)->save();
        $imovel->load(['imagens' => fn ($q) => $q->orderBy('ordem')]);

        return response()->json($this->transform($imovel));
    }

    public function destroy(Imovel $imovel)
    {
        $imovel->delete();

        return response()->noContent();
    }

    protected function validatePayload(Request $request, bool $partial = false): array
    {
        $rules = [
            'titulo' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'descricao' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string']),
            'tipo' => [$partial ? 'sometimes' : 'required', Rule::in(self::TIPOS)],
            'status' => [$partial ? 'sometimes' : 'required', Rule::in(self::STATUS)],
            'preco_centavos' => [$partial ? 'sometimes' : 'required', 'integer', 'min:0'],
            'area_total' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'area_util' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'quartos' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'suites' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'banheiros' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'vagas' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'integer', 'min:0']),
            'cep' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:9']),
            'estado' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'size:2']),
            'cidade' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:80']),
            'bairro' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:120']),
            'logradouro' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:120']),
            'numero' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:20']),
            'complemento' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'string', 'max:80']),
            'lat' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'numeric', 'between:-90,90']),
            'lng' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'numeric', 'between:-180,180']),
            'published_at' => array_merge($partial ? ['sometimes'] : [], ['nullable', 'date']),
        ];

        $validated = $request->validate($rules);

        if (isset($validated['estado'])) {
            $validated['estado'] = strtoupper($validated['estado']);
        }

        return $validated;
    }

    protected function makeUniqueSlug(string $titulo, ?int $ignoreId = null): string
    {
        $base = Str::slug($titulo) ?: Str::random(8);
        $slug = $base;
        $suffix = 1;

        while (
            Imovel::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-" . (++$suffix);
        }

        return $slug;
    }

    protected function transform(Imovel $imovel): array
    {
        $imagens = $imovel->imagens
            ? $imovel->imagens->pluck('path')->all()
            : [];

        return [
            'id' => $imovel->id,
            'titulo' => $imovel->titulo,
            'slug' => $imovel->slug,
            'descricao' => $imovel->descricao,
            'tipo' => $imovel->tipo,
            'status' => $imovel->status,
            'preco_centavos' => (int) $imovel->preco_centavos,
            'preco' => (int) $imovel->preco_centavos,
            'area_total' => $imovel->area_total,
            'area_util' => $imovel->area_util,
            'quartos' => $imovel->quartos,
            'suites' => $imovel->suites,
            'banheiros' => $imovel->banheiros,
            'vagas' => $imovel->vagas,
            'cep' => $imovel->cep,
            'estado' => $imovel->estado,
            'cidade' => $imovel->cidade,
            'bairro' => $imovel->bairro,
            'logradouro' => $imovel->logradouro,
            'numero' => $imovel->numero,
            'complemento' => $imovel->complemento,
            'lat' => $imovel->lat,
            'lng' => $imovel->lng,
            'published_at' => $imovel->published_at?->toISOString(),
            'created_at' => $imovel->created_at?->toISOString(),
            'updated_at' => $imovel->updated_at?->toISOString(),
            'endereco' => $this->formatEndereco($imovel),
            'imagens' => $imagens,
        ];
    }

    protected function formatEndereco(Imovel $imovel): ?string
    {
        $partes = [];

        $linha1 = trim(implode(' ', array_filter([$imovel->logradouro, $imovel->numero])));
        if ($linha1 !== '') {
            $partes[] = $linha1;
        }

        foreach ([$imovel->bairro, $imovel->cidade, $imovel->estado, $imovel->cep] as $valor) {
            if (!empty($valor)) {
                $partes[] = $valor;
            }
        }

        return $partes ? implode(' - ', $partes) : null;
    }
}

