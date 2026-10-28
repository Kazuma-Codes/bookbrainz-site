--rollback
BEGIN;

DELETE FROM bookbrainz.relationship_type__attribute_type
WHERE relationship_type = 10 AND attribute_type IN (1, 2, 3);

DELETE FROM bookbrainz.relationship_attribute_type
WHERE id = 3;

COMMIT;