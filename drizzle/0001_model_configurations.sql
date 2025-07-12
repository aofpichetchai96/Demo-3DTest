-- Migration: Add Model Configurations Tables
-- Created: $(date)

-- Model Configurations table
CREATE TABLE "model_configurations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "model_name" VARCHAR(100) NOT NULL UNIQUE,
  "display_name" VARCHAR(255) NOT NULL,
  "file_size" VARCHAR(50),
  "description" TEXT,
  
  -- Position configuration
  "position" JSONB NOT NULL,
  "rotation" JSONB NOT NULL,
  "scale" JSONB NOT NULL,
  
  -- Camera configuration  
  "camera" JSONB NOT NULL,
  
  -- Controls configuration
  "controls" JSONB NOT NULL,
  
  -- Lighting configuration
  "lighting" JSONB NOT NULL,
  
  -- Material mapping
  "materials" JSONB NOT NULL,
  
  -- Model paths
  "paths" JSONB NOT NULL,
  
  -- Active status
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Metadata
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Viewing Presets table  
CREATE TABLE "viewing_presets" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "model_config_id" UUID NOT NULL REFERENCES "model_configurations"("id"),
  "preset_name" VARCHAR(100) NOT NULL,
  "display_name" VARCHAR(255) NOT NULL,
  
  -- Camera preset configuration
  "camera" JSONB NOT NULL,
  "controls" JSONB NOT NULL,
  
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Ensure unique preset names per model
  UNIQUE("model_config_id", "preset_name")
);

-- Create indexes for better performance
CREATE INDEX "idx_model_configurations_model_name" ON "model_configurations"("model_name");
CREATE INDEX "idx_model_configurations_is_active" ON "model_configurations"("is_active");
CREATE INDEX "idx_viewing_presets_model_config_id" ON "viewing_presets"("model_config_id");
CREATE INDEX "idx_viewing_presets_preset_name" ON "viewing_presets"("preset_name");

-- Insert sample data
INSERT INTO "model_configurations" (
  "model_name", "display_name", "file_size", "description",
  "position", "rotation", "scale", "camera", "controls", 
  "lighting", "materials", "paths"
) VALUES 
(
  'adidas',
  'Adidas Sports Shoe',
  '23.4 MB',
  'High-quality 3D scanned Adidas sports shoe model with detailed textures',
  '{"x": 0, "y": 0.2, "z": 0}',
  '{"x": 0, "y": 0.628, "z": 0}',
  '{"x": 6, "y": 6, "z": 6}',
  '{
    "position": {"x": 3.2, "y": 2.0, "z": 4.8},
    "target": {"x": 0, "y": -0.1, "z": 0},
    "fov": 35,
    "near": 0.1,
    "far": 1000
  }',
  '{
    "minDistance": 3.5,
    "maxDistance": 8,
    "autoRotateSpeed": 0.5,
    "enableDamping": true,
    "dampingFactor": 0.05
  }',
  '{
    "ambient": {"color": "#ffffff", "intensity": 0.6},
    "directional": {
      "color": "#ffffff", 
      "intensity": 1,
      "position": {"x": 10, "y": 10, "z": 5},
      "castShadow": true
    },
    "point": {
      "color": "#ffffff",
      "intensity": 0.3,
      "position": {"x": 0, "y": 5, "z": 0}
    }
  }',
  '{
    "sole": {"colorTarget": "secondary", "description": "ส้นรองเท้าและพื้น"},
    "canvas": {"colorTarget": "primary", "description": "ผ้าใบหลัก"},
    "stripe": {"colorTarget": "accent", "description": "แถบและโลโก้"}
  }',
  '[
    "/models/scanned_adidas_sports_shoe.glb",
    "/models/scanned_adidas_sports_shoe/scanned_adidas_sports_shoe.glb"
  ]'
),
(
  'vans',
  'Blue Vans Shoe',
  '18.7 MB',
  'Classic Vans-style shoe model with traditional skateboard shoe design',
  '{"x": 0, "y": 0.3, "z": 0}',
  '{"x": 0, "y": 0.785, "z": 0}',
  '{"x": 5.5, "y": 5.5, "z": 5.5}',
  '{
    "position": {"x": 2.8, "y": 1.8, "z": 4.5},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 40,
    "near": 0.1,
    "far": 1000
  }',
  '{
    "minDistance": 3,
    "maxDistance": 7.5,
    "autoRotateSpeed": 0.4,
    "enableDamping": true,
    "dampingFactor": 0.08
  }',
  '{
    "ambient": {"color": "#ffffff", "intensity": 0.7},
    "directional": {
      "color": "#ffffff",
      "intensity": 0.9, 
      "position": {"x": 8, "y": 8, "z": 4},
      "castShadow": true
    },
    "point": {
      "color": "#ffffff",
      "intensity": 0.2,
      "position": {"x": -2, "y": 4, "z": 2}
    }
  }',
  '{
    "sole": {"colorTarget": "secondary", "description": "ส้นรองเท้าและพื้น"},
    "canvas": {"colorTarget": "primary", "description": "ผ้าใบหลัก"},
    "lace": {"colorTarget": "accent", "description": "เชือกผูกรองเท้า"}
  }',
  '[
    "/models/unused_blue_vans_shoe.glb",
    "/models/unused_blue_vans_shoe/unused_blue_vans_shoe.glb"
  ]'
);

-- Insert viewing presets
INSERT INTO "viewing_presets" (
  "model_config_id", "preset_name", "display_name", "camera", "controls"
)
SELECT 
  mc.id,
  'closeup',
  'Close-up View',
  '{
    "position": {"x": 2.5, "y": 1.5, "z": 3.5},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 25
  }',
  '{
    "minDistance": 2,
    "maxDistance": 5,
    "autoRotateSpeed": 0.3
  }'
FROM "model_configurations" mc WHERE mc.model_name = 'adidas';

INSERT INTO "viewing_presets" (
  "model_config_id", "preset_name", "display_name", "camera", "controls"
)
SELECT 
  mc.id,
  'overview',
  'Overview',
  '{
    "position": {"x": 5, "y": 3, "z": 7},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 45
  }',
  '{
    "minDistance": 4,
    "maxDistance": 10,
    "autoRotateSpeed": 0.5
  }'
FROM "model_configurations" mc WHERE mc.model_name = 'adidas';

INSERT INTO "viewing_presets" (
  "model_config_id", "preset_name", "display_name", "camera", "controls"
)
SELECT 
  mc.id,
  'closeup',
  'Close-up View',
  '{
    "position": {"x": 2.2, "y": 1.3, "z": 3.2},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 30
  }',
  '{
    "minDistance": 2,
    "maxDistance": 4.5,
    "autoRotateSpeed": 0.25
  }'
FROM "model_configurations" mc WHERE mc.model_name = 'vans';

INSERT INTO "viewing_presets" (
  "model_config_id", "preset_name", "display_name", "camera", "controls"
)
SELECT 
  mc.id,
  'side',
  'Side View',
  '{
    "position": {"x": 6, "y": 2, "z": 0},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 35
  }',
  '{
    "minDistance": 3.5,
    "maxDistance": 8,
    "autoRotateSpeed": 0.2
  }'
FROM "model_configurations" mc WHERE mc.model_name = 'vans';
