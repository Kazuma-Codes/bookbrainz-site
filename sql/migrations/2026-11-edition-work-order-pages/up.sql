BEGIN;

-- Add 'page' relationship attribute type (text value)
INSERT INTO bookbrainz.relationship_attribute_type (id, parent, root, child_order, name, description)
VALUES
	(3, NULL, 3, 0, 'page', 'This attribute indicates the starting page number or pagination of a work in an edition.')
ON CONFLICT (id) DO NOTHING;

-- Associate position (1), number (2), and page (3) with relationship type 10 (Edition contains Work)
INSERT INTO bookbrainz.relationship_type__attribute_type (relationship_type, attribute_type)
VALUES
	(10, 1),
	(10, 2),
	(10, 3)
ON CONFLICT DO NOTHING;

COMMIT;