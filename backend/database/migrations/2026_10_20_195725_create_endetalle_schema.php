<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();                  // free | estudiante | pro
            $table->string('name');
            $table->unsignedTinyInteger('level')->unique();    // 0, 1, 2
            $table->decimal('price', 10, 2)->default(0);
            $table->char('currency', 3)->default('ARS');
            $table->string('interval', 10)->default('month');  // month | year
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->unsignedInteger('detail_limit')->nullable(); // null = todo el catálogo
            $table->boolean('allows_dwg')->default(false);
            $table->boolean('allows_skp')->default(false);
            $table->boolean('allows_ebooks')->default(false);
            $table->boolean('is_recommended')->default(false);
            $table->string('highlight_color', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained()->restrictOnDelete();
            $table->string('status', 20)->default('pending'); // pending | active | past_due | cancelled | expired
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('provider', 20)->nullable();       // mercadopago | paypal | manual
            $table->string('provider_subscription_id')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
            $table->unique(['provider', 'provider_subscription_id']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider', 20);
            $table->string('provider_payment_id');
            $table->decimal('amount', 10, 2);
            $table->char('currency', 3);
            $table->string('status', 20);
            $table->json('payload')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->unique(['provider', 'provider_payment_id']);
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('image_url', 2048)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['parent_id', 'slug']);
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('details', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('subcategory_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('required_plan_id')->nullable()->constrained('plans')->restrictOnDelete();
            $table->string('status', 20)->default('pending');  // draft | pending | published | archived
            $table->string('cover_url', 2048)->nullable();
            $table->json('specs')->nullable();
            $table->json('materials')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->unsignedInteger('votes_count')->default(0);
            $table->text('review_notes')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status']);
        });

        Schema::create('detail_tag', function (Blueprint $table) {
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->primary(['detail_id', 'tag_id']);
        });

        Schema::create('detail_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20)->default('detail'); // section | plan | elevation | axonometric | detail | photo
            $table->string('url', 2048);
            $table->string('caption')->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('detail_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->string('type', 10);                        // dwg | skp
            $table->string('path')->nullable();                // storage privado
            $table->string('external_url', 2048)->nullable();
            $table->string('original_name')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->timestamps();
            $table->unique(['detail_id', 'type']);
        });

        Schema::create('detail_votes', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['user_id', 'detail_id']);
        });

        Schema::create('detail_views', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->timestamp('first_viewed_at')->useCurrent();
            $table->primary(['user_id', 'detail_id']);
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['user_id', 'detail_id']);
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
            $table->text('body');
            $table->timestamps();
            $table->index(['detail_id', 'created_at']);
        });

        Schema::create('error_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detail_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('description');
            $table->string('status', 20)->default('pending'); // pending | resolved
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index('status');
        });

        Schema::create('user_likes', function (Blueprint $table) {
            $table->foreignId('from_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('to_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['from_user_id', 'to_user_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['recipient_id', 'read_at']);
            $table->index(['sender_id', 'recipient_id']);
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->string('status', 20)->default('new');     // new | read | answered
            $table->timestamps();
        });

        Schema::create('ebooks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_url', 2048)->nullable();
            $table->string('file_path')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->longText('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'settings', 'ebooks', 'contact_messages', 'messages', 'user_likes',
            'error_reports', 'comments', 'favorites', 'detail_views', 'detail_votes',
            'detail_files', 'detail_images', 'detail_tag', 'details', 'tags',
            'categories', 'payments', 'subscriptions', 'plans',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
};